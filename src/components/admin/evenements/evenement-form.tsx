"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { evenementSchema, type EvenementInput } from "@/lib/validations/admin/actualites";
import { createEvenement, updateEvenement } from "@/actions/admin/actualites";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { Database } from "@/types/database";

type Evenement = Database["public"]["Tables"]["evenements"]["Row"];

export function EvenementForm({
  evenement,
  onSaved,
}: {
  evenement?: Evenement;
  onSaved: () => void;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(evenement?.image_url ?? null);

  const {
  register,
  handleSubmit,
  control,
  formState: { errors, isSubmitting },
  } = useForm<EvenementInput>({
  resolver: zodResolver(evenementSchema),
  defaultValues: evenement
  ? {
  titre: evenement.titre,
  description: evenement.description ?? "",
  date_evenement: evenement.date_evenement.slice(0, 16),
  lieu: evenement.lieu ?? "",
  image_url: evenement.image_url ?? "",
  publie: evenement.publie,
  }
  : { titre: "", description: "", date_evenement: "", lieu: "", image_url: "", publie: false },
  });

  async function onSubmit(values: EvenementInput) {
  const fd = new FormData();
  fd.set("titre", values.titre);
  fd.set("description", values.description ?? "");
  fd.set("date_evenement", values.date_evenement);
  fd.set("lieu", values.lieu ?? "");
  fd.set("image_url", imageUrl ?? "");
  fd.set("publie", String(values.publie));

  const result = evenement
  ? await updateEvenement(evenement.id, fd)
  : await createEvenement(fd);

  if (result?.error) toast.error(result.error);
  else {
  toast.success(evenement ? "Événement mis à jour." : "Événement créé.");
  onSaved();
  }
  }

  return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  <div>
  <label className="text-sm font-medium text-primrose-ink">Titre</label>
  <input
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("titre")}
  />
  {errors.titre && <p className="mt-1 text-xs text-primrose-alert">Requis.</p>}
  </div>

  <div>
  <label className="text-sm font-medium text-primrose-ink">Description</label>
  <textarea
  rows={3}
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("description")}
  />
  </div>

  <div className="grid grid-cols-2 gap-3">
  <div>
  <label className="text-sm font-medium text-primrose-ink">Date de l&apos;événement</label>
  <input
  type="datetime-local"
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("date_evenement")}
  />
  {errors.date_evenement && (
  <p className="mt-1 text-xs text-primrose-alert">{errors.date_evenement.message}</p>
  )}
  </div>
  <div>
  <label className="text-sm font-medium text-primrose-ink">Lieu</label>
  <input
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("lieu")}
  />
  </div>
  </div>

  <div>
  <label className="text-sm font-medium text-primrose-ink">Image</label>
  <div className="mt-1">
  <ImageUploadField value={imageUrl} onChange={setImageUrl} folder="evenements" />
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
  Publié
  </label>

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
