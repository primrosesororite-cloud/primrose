"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  membreEquipeSchema,
  partenaireSchema,
  reseauSocialSchema,
} from "@/lib/validations/admin/equipe";

type ActionResult = { error?: string } | void;

// --- Équipe ---

export async function createMembreEquipe(
  photoUrl: string | null,
  ordre: number,
  formData: FormData
): Promise<ActionResult> {
  const parsed = membreEquipeSchema.safeParse({
    nom: formData.get("nom"),
    fonction: formData.get("fonction"),
    bio: formData.get("bio"),
  });
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase.from("equipe").insert({
    nom: parsed.data.nom,
    fonction: parsed.data.fonction || null,
    bio: parsed.data.bio || null,
    photo_url: photoUrl,
    ordre,
  });
  if (error) return { error: "La création a échoué." };
  revalidatePath("/admin/equipe");
}

export async function updateMembreEquipe(
  id: string,
  photoUrl: string | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = membreEquipeSchema.safeParse({
    nom: formData.get("nom"),
    fonction: formData.get("fonction"),
    bio: formData.get("bio"),
  });
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("equipe")
    .update({
      nom: parsed.data.nom,
      fonction: parsed.data.fonction || null,
      bio: parsed.data.bio || null,
      photo_url: photoUrl,
    })
    .eq("id", id);
  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/equipe");
}

export async function deleteMembreEquipe(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("equipe").delete().eq("id", id);
  if (error) return { error: "La suppression a échoué." };
  revalidatePath("/admin/equipe");
}

export async function toggleMembreEquipeActif(id: string, actif: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("equipe").update({ actif }).eq("id", id);
  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/equipe");
}

export async function reorderEquipe(orderedIds: string[]): Promise<ActionResult> {
  const supabase = await createClient();
  const results = await Promise.all(
    orderedIds.map((id, i) => supabase.from("equipe").update({ ordre: i + 1 }).eq("id", id))
  );
  if (results.some((r) => r.error)) return { error: "Le réordonnancement a échoué." };
  revalidatePath("/admin/equipe");
}

// --- Partenaires ---

export async function createPartenaire(
  logoUrl: string | null,
  ordre: number,
  formData: FormData
): Promise<ActionResult> {
  const parsed = partenaireSchema.safeParse({
    nom: formData.get("nom"),
    lien: formData.get("lien"),
  });
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase.from("partenaires").insert({
    nom: parsed.data.nom,
    lien: parsed.data.lien || null,
    logo_url: logoUrl,
    ordre,
  });
  if (error) return { error: "La création a échoué." };
  revalidatePath("/admin/partenaires");
}

export async function updatePartenaire(
  id: string,
  logoUrl: string | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = partenaireSchema.safeParse({
    nom: formData.get("nom"),
    lien: formData.get("lien"),
  });
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("partenaires")
    .update({ nom: parsed.data.nom, lien: parsed.data.lien || null, logo_url: logoUrl })
    .eq("id", id);
  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/partenaires");
}

export async function deletePartenaire(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("partenaires").delete().eq("id", id);
  if (error) return { error: "La suppression a échoué." };
  revalidatePath("/admin/partenaires");
}

export async function togglePartenaireActif(id: string, actif: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("partenaires").update({ actif }).eq("id", id);
  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/partenaires");
}

export async function reorderPartenaires(orderedIds: string[]): Promise<ActionResult> {
  const supabase = await createClient();
  const results = await Promise.all(
    orderedIds.map((id, i) => supabase.from("partenaires").update({ ordre: i + 1 }).eq("id", id))
  );
  if (results.some((r) => r.error)) return { error: "Le réordonnancement a échoué." };
  revalidatePath("/admin/partenaires");
}

// --- Réseaux sociaux ---

export async function createReseauSocial(formData: FormData): Promise<ActionResult> {
  const parsed = reseauSocialSchema.safeParse({
    plateforme: formData.get("plateforme"),
    url: formData.get("url"),
  });
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase.from("reseaux_sociaux").insert(parsed.data);
  if (error) return { error: "La création a échoué." };
  revalidatePath("/admin/reseaux-sociaux");
}

export async function updateReseauSocial(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = reseauSocialSchema.safeParse({
    plateforme: formData.get("plateforme"),
    url: formData.get("url"),
  });
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase.from("reseaux_sociaux").update(parsed.data).eq("id", id);
  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/reseaux-sociaux");
}

export async function deleteReseauSocial(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("reseaux_sociaux").delete().eq("id", id);
  if (error) return { error: "La suppression a échoué." };
  revalidatePath("/admin/reseaux-sociaux");
}

export async function toggleReseauSocialActif(id: string, actif: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("reseaux_sociaux").update({ actif }).eq("id", id);
  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/reseaux-sociaux");
}
