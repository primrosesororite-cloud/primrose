"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { actualiteSchema, evenementSchema } from "@/lib/validations/admin/actualites";
import { genererApercu } from "@/lib/apercu-lien";
import type { ApercuLien } from "@/types/database";

type ActionResult = { error?: string; avertissement?: string } | void;

const AVERTISSEMENT_APERCU =
  "Le lien est enregistré, mais l'aperçu n'a pas pu être récupéré (site indisponible ?). Réenregistrez plus tard avec « Actualiser l'aperçu ».";

type Supabase = Awaited<ReturnType<typeof createClient>>;

/**
 * Aperçu de l'article externe : récupéré seulement si le lien est nouveau,
 * s'il manque encore ou si l'admin demande à l'actualiser. En cas d'échec
 * (site partenaire indisponible), le lien est tout de même enregistré.
 */
async function preparerApercu(
  supabase: Supabase,
  lien: string,
  existant: { lien_externe: string | null; apercu: ApercuLien | null } | null,
  actualiser: boolean
): Promise<{ lien_externe?: string | null; apercu?: ApercuLien | null; avertissement?: string }> {
  // Aucun lien, ni avant ni maintenant : on n'écrit pas ces colonnes (l'admin
  // reste fonctionnel même si la migration 008 n'est pas encore appliquée).
  if (!lien) return existant?.lien_externe ? { lien_externe: null, apercu: null } : {};
  if (!actualiser && existant?.lien_externe === lien && existant.apercu) {
    return { lien_externe: lien, apercu: existant.apercu };
  }
  try {
    return { lien_externe: lien, apercu: await genererApercu(lien, supabase.storage.from("images-public")) };
  } catch {
    return { lien_externe: lien, apercu: null, avertissement: AVERTISSEMENT_APERCU };
  }
}

function parseActualite(formData: FormData) {
  return actualiteSchema.safeParse({
    slug: formData.get("slug"),
    titre: formData.get("titre"),
    resume: formData.get("resume"),
    image_url: formData.get("image_url"),
    lien_externe: formData.get("lien_externe") ?? "",
    publie: formData.get("publie") === "true",
    date_publication: formData.get("date_publication"),
  });
}

function parseContenu(formData: FormData): Record<string, unknown> | null {
  const raw = formData.get("contenu");
  if (!raw || typeof raw !== "string") return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function createActualite(formData: FormData): Promise<ActionResult> {
  const parsed = parseActualite(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { avertissement, ...lien } = await preparerApercu(supabase, parsed.data.lien_externe ?? "", null, false);

  const { error } = await supabase.from("actualites").insert({
    slug: parsed.data.slug,
    titre: parsed.data.titre,
    resume: parsed.data.resume || null,
    contenu: parseContenu(formData),
    image_url: parsed.data.image_url || null,
    ...lien,
    publie: parsed.data.publie,
    date_publication: parsed.data.date_publication || (parsed.data.publie ? new Date().toISOString() : null),
    auteur_id: userData.user?.id ?? null,
  });

  if (error) {
    return { error: error.code === "23505" ? "Ce slug existe déjà." : "La création a échoué." };
  }
  revalidatePath("/admin/actualites");
  revalidatePath("/", "layout");
  if (avertissement) return { avertissement };
}

export async function updateActualite(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = parseActualite(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };

  const supabase = await createClient();
  const { data: existant } = await supabase
    .from("actualites")
    .select("lien_externe, apercu")
    .eq("id", id)
    .single();
  const { avertissement, ...lien } = await preparerApercu(
    supabase,
    parsed.data.lien_externe ?? "",
    existant,
    formData.get("actualiser_apercu") === "true"
  );
  const { error } = await supabase
    .from("actualites")
    .update({
      slug: parsed.data.slug,
      titre: parsed.data.titre,
      resume: parsed.data.resume || null,
      contenu: parseContenu(formData),
      image_url: parsed.data.image_url || null,
      ...lien,
      publie: parsed.data.publie,
      date_publication: parsed.data.date_publication || (parsed.data.publie ? new Date().toISOString() : null),
    })
    .eq("id", id);

  if (error) {
    return { error: error.code === "23505" ? "Ce slug existe déjà." : "La mise à jour a échoué." };
  }
  revalidatePath("/admin/actualites");
  revalidatePath("/", "layout");
  if (avertissement) return { avertissement };
}

export async function deleteActualite(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("actualites").delete().eq("id", id);
  if (error) return { error: "La suppression a échoué." };
  revalidatePath("/admin/actualites");
  revalidatePath("/", "layout");
}

export async function createEvenement(formData: FormData): Promise<ActionResult> {
  const parsed = evenementSchema.safeParse({
    titre: formData.get("titre"),
    description: formData.get("description"),
    date_evenement: formData.get("date_evenement"),
    lieu: formData.get("lieu"),
    image_url: formData.get("image_url"),
    publie: formData.get("publie") === "true",
  });
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase.from("evenements").insert({
    titre: parsed.data.titre,
    description: parsed.data.description || null,
    date_evenement: parsed.data.date_evenement,
    lieu: parsed.data.lieu || null,
    image_url: parsed.data.image_url || null,
    publie: parsed.data.publie,
  });

  if (error) return { error: "La création a échoué." };
  revalidatePath("/admin/evenements");
  revalidatePath("/", "layout");
}

export async function updateEvenement(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = evenementSchema.safeParse({
    titre: formData.get("titre"),
    description: formData.get("description"),
    date_evenement: formData.get("date_evenement"),
    lieu: formData.get("lieu"),
    image_url: formData.get("image_url"),
    publie: formData.get("publie") === "true",
  });
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("evenements")
    .update({
      titre: parsed.data.titre,
      description: parsed.data.description || null,
      date_evenement: parsed.data.date_evenement,
      lieu: parsed.data.lieu || null,
      image_url: parsed.data.image_url || null,
      publie: parsed.data.publie,
    })
    .eq("id", id);

  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/evenements");
  revalidatePath("/", "layout");
}

export async function deleteEvenement(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("evenements").delete().eq("id", id);
  if (error) return { error: "La suppression a échoué." };
  revalidatePath("/admin/evenements");
  revalidatePath("/", "layout");
}
