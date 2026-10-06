"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { demandeAideUpdateSchema } from "@/lib/validations/admin/demandes-aide";

type ActionResult = { error?: string } | void;

export async function updateDemandeAide(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = demandeAideUpdateSchema.safeParse({
    statut: formData.get("statut"),
    notesInternes: formData.get("notesInternes"),
    assigneeId: formData.get("assigneeId"),
  });
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("demandes_aide")
    .update({
      statut: parsed.data.statut,
      notes_internes: parsed.data.notesInternes || null,
      assignee_id: parsed.data.assigneeId || null,
    })
    .eq("id", id);

  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath(`/admin/demandes-aide/${id}`);
  revalidatePath("/admin/demandes-aide");
}
