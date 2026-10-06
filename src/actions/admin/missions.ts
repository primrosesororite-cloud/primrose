"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { missionEditSchema, valeurSchema } from "@/lib/validations/admin/missions";

type ActionResult = { error?: string } | void;

export async function updateMission(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = missionEditSchema.safeParse({
    titre: formData.get("titre"),
    description: formData.get("description"),
    icone: formData.get("icone"),
  });
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("missions")
    .update({
      titre: parsed.data.titre,
      description: parsed.data.description,
      icone: parsed.data.icone || null,
    })
    .eq("id", id);

  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/missions");
}

export async function toggleMissionActif(id: string, actif: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("missions").update({ actif }).eq("id", id);
  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/missions");
}

export async function reorderMissions(orderedIds: string[]): Promise<ActionResult> {
  const supabase = await createClient();
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("missions").update({ ordre: index + 1 }).eq("id", id)
    )
  );
  if (results.some((r) => r.error)) return { error: "Le réordonnancement a échoué." };
  revalidatePath("/admin/missions");
}

export async function createValeur(
  missionId: string,
  ordre: number,
  formData: FormData
): Promise<ActionResult> {
  const parsed = valeurSchema.safeParse({ libelle: formData.get("libelle") });
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("valeurs")
    .insert({ mission_id: missionId, libelle: parsed.data.libelle, ordre });

  if (error) return { error: "La création a échoué." };
  revalidatePath("/admin/missions");
}

export async function updateValeur(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = valeurSchema.safeParse({ libelle: formData.get("libelle") });
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("valeurs")
    .update({ libelle: parsed.data.libelle })
    .eq("id", id);

  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/missions");
}

export async function deleteValeur(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("valeurs").delete().eq("id", id);
  if (error) return { error: "La suppression a échoué." };
  revalidatePath("/admin/missions");
}

export async function reorderValeurs(orderedIds: string[]): Promise<ActionResult> {
  const supabase = await createClient();
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("valeurs").update({ ordre: index + 1 }).eq("id", id)
    )
  );
  if (results.some((r) => r.error)) return { error: "Le réordonnancement a échoué." };
  revalidatePath("/admin/missions");
}
