"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formationSchema } from "@/lib/validations/admin/formations";

type ActionResult = { error?: string } | void;

function parseFormation(formData: FormData) {
  const places = formData.get("places");
  return formationSchema.safeParse({
    slug: formData.get("slug"),
    titre: formData.get("titre"),
    description: formData.get("description"),
    public_cible: formData.get("public_cible"),
    date_debut: formData.get("date_debut"),
    lieu: formData.get("lieu"),
    places: places ? Number(places) : undefined,
    statut: formData.get("statut") || "brouillon",
  });
}

export async function createFormation(formData: FormData): Promise<ActionResult> {
  const parsed = parseFormation(formData);
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase.from("formations").insert({
    slug: parsed.data.slug,
    titre: parsed.data.titre,
    description: parsed.data.description || null,
    public_cible: parsed.data.public_cible || null,
    date_debut: parsed.data.date_debut || null,
    lieu: parsed.data.lieu || null,
    places: parsed.data.places ?? null,
    statut: parsed.data.statut,
  });

  if (error) {
    return {
      error: error.code === "23505" ? "Ce slug existe déjà." : "La création a échoué.",
    };
  }
  revalidatePath("/admin/formations");
}

export async function updateFormation(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = parseFormation(formData);
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("formations")
    .update({
      slug: parsed.data.slug,
      titre: parsed.data.titre,
      description: parsed.data.description || null,
      public_cible: parsed.data.public_cible || null,
      date_debut: parsed.data.date_debut || null,
      lieu: parsed.data.lieu || null,
      places: parsed.data.places ?? null,
      statut: parsed.data.statut,
    })
    .eq("id", id);

  if (error) {
    return {
      error: error.code === "23505" ? "Ce slug existe déjà." : "La mise à jour a échoué.",
    };
  }
  revalidatePath("/admin/formations");
}

export async function deleteFormation(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("formations").delete().eq("id", id);
  if (error) return { error: "La suppression a échoué." };
  revalidatePath("/admin/formations");
}

export async function updateInscriptionStatut(
  id: string,
  statut: "en_attente" | "acceptee" | "refusee"
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("formation_inscriptions")
    .update({ statut })
    .eq("id", id);

  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/formations");
}
