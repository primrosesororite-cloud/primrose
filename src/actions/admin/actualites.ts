"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { actualiteSchema, evenementSchema } from "@/lib/validations/admin/actualites";

type ActionResult = { error?: string } | void;

function parseActualite(formData: FormData) {
  return actualiteSchema.safeParse({
    slug: formData.get("slug"),
    titre: formData.get("titre"),
    resume: formData.get("resume"),
    image_url: formData.get("image_url"),
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
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  const { error } = await supabase.from("actualites").insert({
    slug: parsed.data.slug,
    titre: parsed.data.titre,
    resume: parsed.data.resume || null,
    contenu: parseContenu(formData),
    image_url: parsed.data.image_url || null,
    publie: parsed.data.publie,
    date_publication: parsed.data.date_publication || (parsed.data.publie ? new Date().toISOString() : null),
    auteur_id: userData.user?.id ?? null,
  });

  if (error) {
    return { error: error.code === "23505" ? "Ce slug existe déjà." : "La création a échoué." };
  }
  revalidatePath("/admin/actualites");
  revalidatePath("/", "layout");
}

export async function updateActualite(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = parseActualite(formData);
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("actualites")
    .update({
      slug: parsed.data.slug,
      titre: parsed.data.titre,
      resume: parsed.data.resume || null,
      contenu: parseContenu(formData),
      image_url: parsed.data.image_url || null,
      publie: parsed.data.publie,
      date_publication: parsed.data.date_publication || (parsed.data.publie ? new Date().toISOString() : null),
    })
    .eq("id", id);

  if (error) {
    return { error: error.code === "23505" ? "Ce slug existe déjà." : "La mise à jour a échoué." };
  }
  revalidatePath("/admin/actualites");
  revalidatePath("/", "layout");
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
