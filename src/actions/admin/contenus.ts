"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { visionSchema, chiffreCleSchema } from "@/lib/validations/admin/contenus";

type ActionResult = { error?: string } | void;

export async function updateVision(formData: FormData): Promise<ActionResult> {
  const parsed = visionSchema.safeParse({
    titre: formData.get("titre"),
    texte: formData.get("texte"),
  });
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("pages_content")
    .update({ content: parsed.data })
    .eq("key", "home.vision");

  if (error) return { error: "La sauvegarde a échoué." };
  revalidatePath("/admin/contenus");
}

export async function createChiffreCle(formData: FormData): Promise<ActionResult> {
  const parsed = chiffreCleSchema.safeParse({
    libelle: formData.get("libelle"),
    valeur: formData.get("valeur"),
    suffixe: formData.get("suffixe"),
    ordre: formData.get("ordre"),
  });
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase.from("chiffres_cles").insert({
    libelle: parsed.data.libelle,
    valeur: parsed.data.valeur,
    suffixe: parsed.data.suffixe || "",
    ordre: parsed.data.ordre,
  });

  if (error) return { error: "La création a échoué." };
  revalidatePath("/admin/contenus");
}

export async function updateChiffreCle(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const parsed = chiffreCleSchema.safeParse({
    libelle: formData.get("libelle"),
    valeur: formData.get("valeur"),
    suffixe: formData.get("suffixe"),
    ordre: formData.get("ordre"),
  });
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("chiffres_cles")
    .update({
      libelle: parsed.data.libelle,
      valeur: parsed.data.valeur,
      suffixe: parsed.data.suffixe || "",
      ordre: parsed.data.ordre,
    })
    .eq("id", id);

  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/contenus");
}

export async function deleteChiffreCle(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("chiffres_cles").delete().eq("id", id);
  if (error) return { error: "La suppression a échoué." };
  revalidatePath("/admin/contenus");
}

export async function toggleChiffreCleActif(
  id: string,
  actif: boolean
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("chiffres_cles").update({ actif }).eq("id", id);
  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/contenus");
}
