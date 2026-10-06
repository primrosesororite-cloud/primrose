import { Resend } from "resend";

const isConfigured =
  !!process.env.RESEND_API_KEY && !!process.env.ASSOCIATION_ALERT_EMAIL;

const isReplyConfigured = !!process.env.RESEND_API_KEY;

/**
 * Réponse d'un membre de l'équipe à une personne ayant rempli un formulaire
 * public (adhésion, contact). Retourne une erreur explicite (contrairement à
 * notifyUrgentDemand) car ici l'échec doit être visible dans l'interface admin.
 */
export async function sendReplyEmail({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}): Promise<{ error?: string }> {
  if (!isReplyConfigured) {
    return { error: "L'envoi d'e-mail n'est pas configuré (RESEND_API_KEY manquante)." };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "contact@sororiteprimrose.org",
      to,
      subject,
      text: message,
    });
    if (error) return { error: "L'envoi de l'e-mail a échoué." };
    return {};
  } catch {
    return { error: "L'envoi de l'e-mail a échoué." };
  }
}

/**
 * Alerte l'équipe qu'une demande d'aide URGENTE vient d'arriver.
 * Ne contient jamais la coordonnée ou le message de la personne : l'e-mail
 * n'est pas un canal confidentiel, seul le tableau de bord (accès authentifié)
 * doit exposer ce contenu. Best-effort : une erreur ici ne doit jamais faire
 * échouer la soumission du formulaire côté victime.
 */
export async function notifyUrgentDemand(): Promise<void> {
  if (!isConfigured) return;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "alertes@sororiteprimrose.org",
      to: process.env.ASSOCIATION_ALERT_EMAIL!,
      subject: "Nouvelle demande d'aide urgente – Primrose",
      text:
        "Une nouvelle demande d'aide marquée URGENTE vient d'être reçue.\n\n" +
        "Connectez-vous au tableau de bord pour la consulter et y répondre rapidement.\n\n" +
        "Cet e-mail ne contient volontairement aucune donnée personnelle.",
    });
  } catch (error) {
    console.error("Échec de l'envoi de la notification urgente :", error);
  }
}
