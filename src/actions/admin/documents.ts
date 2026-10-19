"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { documentSchema, documentFichierSchema } from "@/lib/validations/admin/documents";

type ActionResult = { error?: string } | void;

const BUCKET = "documents-public";

function parseDocument(formData: FormData) {
  return documentSchema.safeParse({
    slug: formData.get("slug"),
    titre: formData.get("titre"),
    description: formData.get("description"),
    categorie: formData.get("categorie"),
    date_publication: formData.get("date_publication"),
    publie: formData.get("publie") === "true",
  });
}

/** Fichier facultatif en modification : présent seulement si un nouveau PDF a été envoyé. */
function parseFichier(formData: FormData) {
  if (!formData.get("chemin")) return null;
  return documentFichierSchema.safeParse({
    chemin: formData.get("chemin"),
    tailleOctets: Number(formData.get("tailleOctets")),
  });
}

function revalidateDocuments() {
  revalidatePath("/admin/documents");
  revalidatePath("/", "layout");
}

/** Le PDF a déjà été envoyé côté client dans le bucket ; ceci enregistre la fiche. */
export async function createDocument(formData: FormData): Promise<ActionResult> {
  const parsed = parseDocument(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };
  const fichier = parseFichier(formData);
  if (!fichier) return { error: "Ajoutez un fichier PDF." };
  if (!fichier.success) return { error: fichier.error.issues[0]?.message ?? "Fichier invalide." };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  // URL reconstruite côté serveur : jamais celle fournie par le navigateur.
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fichier.data.chemin);

  const { error } = await supabase.from("documents").insert({
    slug: parsed.data.slug,
    titre: parsed.data.titre,
    description: parsed.data.description || null,
    categorie: parsed.data.categorie,
    date_publication: parsed.data.date_publication || null,
    publie: parsed.data.publie,
    fichier_url: urlData.publicUrl,
    chemin: fichier.data.chemin,
    taille_octets: fichier.data.tailleOctets,
    uploaded_by: userData.user?.id ?? null,
  });

  if (error) {
    await supabase.storage.from(BUCKET).remove([fichier.data.chemin]);
    return { error: error.code === "23505" ? "Ce slug est déjà utilisé." : "La création a échoué." };
  }
  revalidateDocuments();
}

export async function updateDocument(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = parseDocument(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };
  const fichier = parseFichier(formData);
  if (fichier && !fichier.success) {
    return { error: fichier.error.issues[0]?.message ?? "Fichier invalide." };
  }

  const supabase = await createClient();
  const { data: existant } = await supabase.from("documents").select("chemin").eq("id", id).single();
  if (!existant) return { error: "Document introuvable." };

  const nouveauFichier = fichier?.success ? fichier.data : null;
  const { error } = await supabase
    .from("documents")
    .update({
      slug: parsed.data.slug,
      titre: parsed.data.titre,
      description: parsed.data.description || null,
      categorie: parsed.data.categorie,
      date_publication: parsed.data.date_publication || null,
      publie: parsed.data.publie,
      ...(nouveauFichier && {
        chemin: nouveauFichier.chemin,
        taille_octets: nouveauFichier.tailleOctets,
        fichier_url: supabase.storage.from(BUCKET).getPublicUrl(nouveauFichier.chemin).data.publicUrl,
      }),
    })
    .eq("id", id);

  if (error) {
    if (nouveauFichier) await supabase.storage.from(BUCKET).remove([nouveauFichier.chemin]);
    return { error: error.code === "23505" ? "Ce slug est déjà utilisé." : "La mise à jour a échoué." };
  }
  if (nouveauFichier && existant.chemin !== nouveauFichier.chemin) {
    await supabase.storage.from(BUCKET).remove([existant.chemin]);
  }
  revalidateDocuments();
}

export async function toggleDocumentPublie(id: string, publie: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("documents").update({ publie }).eq("id", id);
  if (error) return { error: "La mise à jour a échoué." };
  revalidateDocuments();
}

export async function deleteDocument(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: existant } = await supabase.from("documents").select("chemin").eq("id", id).single();
  if (!existant) return { error: "Document introuvable." };

  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) return { error: "La suppression a échoué." };
  await supabase.storage.from(BUCKET).remove([existant.chemin]);
  revalidateDocuments();
}
