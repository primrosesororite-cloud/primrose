"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { JSONContent } from "@tiptap/react";
import { actualiteSchema, type ActualiteInput } from "@/lib/validations/admin/actualites";
import { createActualite, updateActualite } from "@/actions/admin/actualites";
import { RichEditor } from "@/components/admin/rich-editor";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { Database } from "@/types/database";

type Actualite = Database["public"]["Tables"]["actualites"]["Row"];

export function ActualiteForm({
  actualite,
  onSaved,
}: {
  actualite?: Actualite;
  onSaved: () => void;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(actualite?.image_url ?? null);
  const [contenu, setContenu] = useState<JSONContent | null>(
    (actualite?.contenu as JSONContent | null) ?? null
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ActualiteInput>({
    resolver: zodResolver(actualiteSchema),
    defaultValues: actualite
      ? {
          slug: actualite.slug,
          titre: actualite.titre,
          resume: actualite.resume ?? "",
          image_url: actualite.image_url ?? "",
          publie: actualite.publie,
          date_publication: actualite.date_publication
            ? actualite.date_publication.slice(0, 16)
            : "",
        }
      : { slug: "", titre: "", resume: "", image_url: "", publie: false, date_publication: "" },
  });

  async function onSubmit(values: ActualiteInput) {
    const fd = new FormData();
    fd.set("slug", values.slug);
    fd.set("titre", values.titre);
    fd.set("resume", values.resume ?? "");
    fd.set("image_url", imageUrl ?? "");
    fd.set("publie", String(values.publie));
    fd.set("date_publication", values.date_publication ?? "");
    fd.set("contenu", JSON.stringify(contenu ?? {}));

    const result = actualite
      ? await updateActualite(actualite.id, fd)
      : await createActualite(fd);

    if (result?.error) toast.error(result.error);
    else {
      toast.success(actualite ? "Actualité mise à jour." : "Actualité créée.");
      onSaved();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-primrose-ink">Titre</label>
          <input
            className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
            {...register("titre")}
          />
          {errors.titre && <p className="mt-1 text-xs text-primrose-alert">Requis.</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-primrose-ink">Slug (URL)</label>
          <input
            className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
            {...register("slug")}
          />
          {errors.slug && (
            <p className="mt-1 text-xs text-primrose-alert">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-primrose-ink">Résumé</label>
        <textarea
          rows={2}
          className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
          {...register("resume")}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-primrose-ink">Image de couverture</label>
        <div className="mt-1">
          <ImageUploadField value={imageUrl} onChange={setImageUrl} folder="actualites" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-primrose-ink">Contenu</label>
        <div className="mt-1">
          <RichEditor content={contenu} onChange={setContenu} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-primrose-ink">
            Publication programmée
          </label>
          <input
            type="datetime-local"
            className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
            {...register("date_publication")}
          />
          <p className="mt-1 text-xs text-primrose-ink/70">
            Laisser vide pour publier dès l&apos;activation ci-dessous.
          </p>
        </div>
        <div className="flex items-end pb-2">
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
            Publié
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-primrose-green-dark px-5 py-2.5 text-sm font-medium text-primrose-white hover:bg-primrose-green-dark/90 disabled:opacity-60"
      >
        {isSubmitting ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
