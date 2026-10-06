"use server";

import { adhesionSchema } from "@/lib/validations/adhesion";
import { createClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { ActionState } from "./contact";

export async function submitAdhesion(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = adhesionSchema.safeParse({
    type: formData.get("type"),
    nom: formData.get("nom"),
    email: formData.get("email"),
    telephone: formData.get("telephone"),
    ville: formData.get("ville"),
    motivation: formData.get("motivation"),
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
    return { status: "success" };
  }

  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`adhesion:${ip}`, {
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
  const { error } = await supabase.from("membres_demandes").insert({
    type: parsed.data.type,
    nom: parsed.data.nom,
    email: parsed.data.email,
    telephone: parsed.data.telephone || null,
    ville: parsed.data.ville || null,
    motivation: parsed.data.motivation || null,
  });

  if (error) {
    return { status: "error", message: "erreurGenerique" };
  }

  return { status: "success" };
}
