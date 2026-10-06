"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { mediaRecordSchema, mediaAltSchema } from "@/lib/validations/admin/medias";

type ActionResult = { error?: string } | void;

/** Le fichier a déjà été envoyé côté client (voir ImageUploadField / médiathèque) ; ceci n'enregistre que les métadonnées. */
export async function recordMedia(formData: FormData): Promise<ActionResult> {
  const parsed = mediaRecordSchema.safeParse({
    url: formData.get("url"),
    chemin: formData.get("chemin"),
    alt: formData.get("alt"),
    tailleOctets: formData.get("tailleOctets") ? Number(formData.get("tailleOctets")) : undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  const { error } = await supabase.from("medias").insert({
    url: parsed.data.url,
    chemin: parsed.data.chemin,
    alt: parsed.data.alt,
    taille_octets: parsed.data.tailleOctets ?? null,
    uploaded_by: userData.user?.id ?? null,
  });

  if (error) return { error: "L'enregistrement a échoué." };
  revalidatePath("/admin/mediatheque");
  revalidatePath("/", "layout");
}

export async function updateMediaAlt(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = mediaAltSchema.safeParse({ alt: formData.get("alt") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase.from("medias").update({ alt: parsed.data.alt }).eq("id", id);
  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/mediatheque");
  revalidatePath("/", "layout");
}

export async function deleteMedia(id: string, chemin: string): Promise<ActionResult> {
  const supabase = await createClient();
  await supabase.storage.from("images-public").remove([chemin]);
  const { error } = await supabase.from("medias").delete().eq("id", id);
  if (error) return { error: "La suppression a échoué." };
  revalidatePath("/admin/mediatheque");
  revalidatePath("/", "layout");
}
