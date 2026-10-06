"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendReplyEmail } from "@/lib/email";
import { replySchema } from "@/lib/validations/admin/demandes";
import type { RequestStatus } from "@/types/database";

type ActionResult = { error?: string } | void;

export async function updateAdhesionStatut(id: string, statut: RequestStatus): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("membres_demandes").update({ statut }).eq("id", id);
  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/adhesions");
}

export async function markMessageLu(id: string, lu: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("messages_contact").update({ lu }).eq("id", id);
  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/messages");
}

export async function replyToEmail(to: string, formData: FormData): Promise<ActionResult> {
  const parsed = replySchema.safeParse({
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { error: "Champs invalides." };

  const result = await sendReplyEmail({ to, subject: parsed.data.subject, message: parsed.data.message });
  if (result.error) return { error: result.error };
}
