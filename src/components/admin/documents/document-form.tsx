"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/format";
import {
  documentSchema,
  DOCUMENT_CATEGORIES,
  type DocumentInput,
} from "@/lib/validations/admin/documents";
import { createDocument, updateDocument } from "@/actions/admin/documents";
import { PdfDropField } from "@/components/admin/documents/pdf-drop-field";
import { CATEGORIE_LABELS } from "@/components/admin/documents/categorie-labels";
import type { Database } from "@/types/database";

type Document = Database["public"]["Tables"]["documents"]["Row"];

const inputClass = "mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm";

export function DocumentForm({
  document,
  onSaved,
}: {
  document?: Document;
  onSaved: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [slugTouched, setSlugTouched] = useState(!!document);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DocumentInput>({
    resolver: zodResolver(documentSchema),
    defaultValues: document
      ? {
          slug: document.slug,
          titre: document.titre,
          description: document.description ?? "",
          categorie: document.categorie,
          date_publication: document.date_publication ?? "",
          publie: document.publie,
        }
      : {
          slug: "",
          titre: "",
          description: "",
          categorie: "rapport",
          date_publication: new Date().toISOString().slice(0, 10),
          publie: false,
        },
  });

  const titreField = register("titre");
  const slugField = register("slug");

  async function onSubmit(values: DocumentInput) {
    if (!document && !file) {
      toast.error("Ajoutez un fichier PDF.");
      return;
    }

    const fd = new FormData();
    fd.set("slug", values.slug);
    fd.set("titre", values.titre);
    fd.set("description", values.description ?? "");
    fd.set("categorie", values.categorie);
    fd.set("date_publication", values.date_publication ?? "");
    fd.set("publie", String(values.publie));

    if (file) {
      const chemin = `documents/${crypto.randomUUID()}.pdf`;
      const supabase = createClient();
      const { error } = await supabase.storage
        .from("documents-public")
        .upload(chemin, file, { contentType: "application/pdf", cacheControl: "31536000" });
      if (error) {
        toast.error("L'envoi du PDF a échoué. Vérifiez votre connexion et réessayez.");
        return;
      }
      fd.set("chemin", chemin);
      fd.set("tailleOctets", String(file.size));
    }

    const result = document ? await updateDocument(document.id, fd) : await createDocument(fd);
    if (result?.error) toast.error(result.error);
    else {
      toast.success(document ? "Document mis à jour." : "Document ajouté.");
      onSaved();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <span className="text-sm font-medium text-primrose-ink">Fichier PDF</span>
        <div className="mt-1">
          <PdfDropField
            file={file}
            onChange={setFile}
            fichierActuel={
              document ? { url: document.fichier_url, taille: document.taille_octets } : undefined
            }
          />
        </div>
      </div>

      <div>
        <label htmlFor="document-titre" className="text-sm font-medium text-primrose-ink">
          Titre
        </label>
        <input
          id="document-titre"
          className={inputClass}
          {...titreField}
          onChange={(e) => {
            titreField.onChange(e);
            if (!slugTouched) setValue("slug", slugify(e.target.value), { shouldValidate: true });
          }}
        />
        {errors.titre && <p className="mt-1 text-xs text-primrose-alert">{errors.titre.message}</p>}
      </div>

      <div>
        <label htmlFor="document-slug" className="text-sm font-medium text-primrose-ink">
          Adresse de la page (slug)
        </label>
        <input
          id="document-slug"
          className={inputClass}
          {...slugField}
          onChange={(e) => {
            slugField.onChange(e);
            setSlugTouched(true);
          }}
        />
        {errors.slug && <p className="mt-1 text-xs text-primrose-alert">{errors.slug.message}</p>}
      </div>

      <div>
        <label htmlFor="document-description" className="text-sm font-medium text-primrose-ink">
          Résumé
        </label>
        <textarea
          id="document-description"
          rows={3}
          className={inputClass}
          placeholder="Quelques lignes pour présenter le document aux lecteurs"
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-primrose-alert">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="document-categorie" className="text-sm font-medium text-primrose-ink">
            Catégorie
          </label>
          <select id="document-categorie" className={inputClass} {...register("categorie")}>
            {DOCUMENT_CATEGORIES.map((categorie) => (
              <option key={categorie} value={categorie}>
                {CATEGORIE_LABELS[categorie]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="document-date" className="text-sm font-medium text-primrose-ink">
            Date du document
          </label>
          <input id="document-date" type="date" className={inputClass} {...register("date_publication")} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-primrose-ink">
        <Controller
          control={control}
          name="publie"
          render={({ field }) => (
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="h-4 w-4 rounded border-primrose-ink/30"
            />
          )}
        />
        Publié (visible par les lecteurs)
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-primrose-green-dark px-5 py-2.5 text-sm font-medium text-primrose-white hover:bg-primrose-green-dark/90 disabled:opacity-60"
      >
        {isSubmitting ? (file ? "Envoi du PDF…" : "Enregistrement…") : "Enregistrer"}
      </button>
    </form>
  );
}
