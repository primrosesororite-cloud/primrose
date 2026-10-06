"use server";

import { aideSchema } from "@/lib/validations/aide";
import { createClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { encryptField } from "@/lib/crypto";
import { notifyUrgentDemand } from "@/lib/email";
import type { ActionState } from "./contact";

export async function submitAide(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = aideSchema.safeParse({
    moyenContact: formData.get("moyenContact"),
    coordonnee: formData.get("coordonnee"),
    message: formData.get("message"),
    urgence: formData.get("urgence") || "normal",
    nePasRecontacterAvant: formData.get("nePasRecontacterAvant"),
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
  const { allowed } = checkRateLimit(`aide:${ip}`, {
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

  // Chiffrement applicatif des champs sensibles avant écriture en base.
  // Échec volontairement bloquant : mieux vaut refuser la demande que de
  // stocker une coordonnée de victime en clair suite à une mauvaise config.
  let coordonneeChiffree: string;
  let messageChiffre: string | null;
  try {
    coordonneeChiffree = encryptField(parsed.data.coordonnee);
    messageChiffre = parsed.data.message ? encryptField(parsed.data.message) : null;
  } catch (error) {
    console.error("Chiffrement demandes_aide indisponible :", error);
    return { status: "error", message: "erreurGenerique" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("demandes_aide").insert({
    moyen_contact: parsed.data.moyenContact,
    coordonnee: coordonneeChiffree,
    message: messageChiffre,
    urgence: parsed.data.urgence,
    ne_pas_recontacter_avant: parsed.data.nePasRecontacterAvant || null,
  });

  if (error) {
    return { status: "error", message: "erreurGenerique" };
  }

  if (parsed.data.urgence === "urgent") {
    await notifyUrgentDemand();
  }

  return { status: "success" };
}
