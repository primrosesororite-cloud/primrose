"use server";

import { formationInscriptionSchema } from "@/lib/validations/formation-inscription";
import { createClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { ActionState } from "./contact";

export async function submitFormationInscription(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = formationInscriptionSchema.safeParse({
    formationId: formData.get("formationId"),
    nom: formData.get("nom"),
    email: formData.get("email"),
    telephone: formData.get("telephone"),
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
    return { status: "success" };
  }

  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`formation:${ip}`, {
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

  // Ne jamais faire confiance au client pour l'état de la formation :
  // on revérifie côté serveur qu'elle est bien ouverte avant d'inscrire.
  const { data: formation } = await supabase
    .from("formations")
    .select("statut")
    .eq("id", parsed.data.formationId)
    .single();

  if (!formation || formation.statut !== "ouverte") {
    return { status: "error", message: "erreurGenerique" };
  }

  const { error } = await supabase.from("formation_inscriptions").insert({
    formation_id: parsed.data.formationId,
    nom: parsed.data.nom,
    email: parsed.data.email,
    telephone: parsed.data.telephone || null,
    message: parsed.data.message || null,
  });

  if (error) {
    return { status: "error", message: "erreurGenerique" };
  }

  return { status: "success" };
}
