"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  documentSchema,
  documentFichierSchema,
  couvertureUrlSchema,
} from "@/lib/validations/admin/documents";

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

function parseCouverture(formData: FormData) {
  return couvertureUrlSchema.safeParse(formData.get("couverture_url") ?? "");
}

function revalidateDocuments() {
  revalidatePath("/admin/documents");
  revalidatePath("/", "layout");
}

const PDF_OU_COUVERTURE = "Ajoutez un PDF ou une image de couverture.";

/**
 * Le PDF (facultatif) a déjà été envoyé côté client dans le bucket ; ceci
 * enregistre la fiche. Il faut au moins un PDF ou une image de couverture.
 */
export async function createDocument(formData: FormData): Promise<ActionResult> {
  const parsed = parseDocument(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };
  const fichier = parseFichier(formData);
  if (fichier && !fichier.success) {
    return { error: fichier.error.issues[0]?.message ?? "Fichier invalide." };
  }
  const couverture = parseCouverture(formData);
  if (!couverture.success) return { error: couverture.error.issues[0]?.message ?? "Image invalide." };
  const pdf = fichier?.success ? fichier.data : null;
  if (!pdf && !couverture.data) return { error: PDF_OU_COUVERTURE };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  const { error } = await supabase.from("documents").insert({
    slug: parsed.data.slug,
    titre: parsed.data.titre,
    description: parsed.data.description || null,
    categorie: parsed.data.categorie,
    date_publication: parsed.data.date_publication || null,
    publie: parsed.data.publie,
    // URL reconstruite côté serveur : jamais celle fournie par le navigateur.
    fichier_url: pdf ? supabase.storage.from(BUCKET).getPublicUrl(pdf.chemin).data.publicUrl : null,
    chemin: pdf?.chemin ?? null,
    taille_octets: pdf?.tailleOctets ?? null,
    couverture_url: couverture.data || null,
    uploaded_by: userData.user?.id ?? null,
  });

  if (error) {
    if (pdf) await supabase.storage.from(BUCKET).remove([pdf.chemin]);
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
  const couverture = parseCouverture(formData);
  if (!couverture.success) return { error: couverture.error.issues[0]?.message ?? "Image invalide." };

  const supabase = await createClient();
  const { data: existant } = await supabase.from("documents").select("chemin").eq("id", id).single();
  if (!existant) return { error: "Document introuvable." };

  const nouveauFichier = fichier?.success ? fichier.data : null;
  if (!nouveauFichier && !existant.chemin && !couverture.data) return { error: PDF_OU_COUVERTURE };
  const { error } = await supabase
    .from("documents")
    .update({
      slug: parsed.data.slug,
      titre: parsed.data.titre,
      description: parsed.data.description || null,
      categorie: parsed.data.categorie,
      date_publication: parsed.data.date_publication || null,
      publie: parsed.data.publie,
      couverture_url: couverture.data || null,
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
  if (nouveauFichier && existant.chemin && existant.chemin !== nouveauFichier.chemin) {
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
  if (existant.chemin) await supabase.storage.from(BUCKET).remove([existant.chemin]);
  revalidateDocuments();
}
