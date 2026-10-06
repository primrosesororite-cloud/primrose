"use server";

import { contactSchema } from "@/lib/validations/contact";
import { createClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitContact(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = contactSchema.safeParse({
    nom: formData.get("nom"),
    email: formData.get("email"),
    telephone: formData.get("telephone"),
    sujet: formData.get("sujet"),
    message: formData.get("message"),
    website: formData.get("website"),
    turnstileToken: formData.get("turnstileToken"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "erreurGenerique",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (parsed.data.website) {
    // Honeypot rempli : requête probablement automatisée, on répond sans détail.
    return { status: "success" };
  }

  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`contact:${ip}`, {
    max: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!allowed) {
    return { status: "error", message: "erreurAntiSpam" };
  }

  const humanVerified = await verifyTurnstile(parsed.data.turnstileToken, ip);
  if (!humanVerified) {
    return { status: "error", message: "erreurAntiSpam" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("messages_contact").insert({
    nom: parsed.data.nom,
    email: parsed.data.email,
    telephone: parsed.data.telephone || null,
    sujet: parsed.data.sujet || null,
    message: parsed.data.message,
  });

  if (error) {
    return { status: "error", message: "erreurGenerique" };
  }

  return { status: "success" };
}
