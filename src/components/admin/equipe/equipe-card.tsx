"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { RowActions } from "@/components/admin/row-actions";
import {
  membreEquipeSchema,
  type MembreEquipeInput,
} from "@/lib/validations/admin/equipe";
import {
  updateMembreEquipe,
  deleteMembreEquipe,
  toggleMembreEquipeActif,
} from "@/actions/admin/equipe";
import type { Database } from "@/types/database";

type Membre = Database["public"]["Tables"]["equipe"]["Row"];

export function EquipeCard({ membre }: { membre: Membre }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(membre.photo_url);
  const {
  register,
  handleSubmit,
  formState: { isSubmitting },
  } = useForm<MembreEquipeInput>({
  resolver: zodResolver(membreEquipeSchema),
  defaultValues: { nom: membre.nom, fonction: membre.fonction ?? "", bio: membre.bio ?? "" },
  });

  async function onSubmit(values: MembreEquipeInput) {
  const fd = new FormData();
  fd.set("nom", values.nom);
  fd.set("fonction", values.fonction ?? "");
  fd.set("bio", values.bio ?? "");
  const result = await updateMembreEquipe(membre.id, photoUrl, fd);
  if (result?.error) toast.error(result.error);
  else toast.success("Membre mis à jour.");
  }

  return (
  <div className="grid grid-cols-[96px_1fr_auto] items-start gap-4">
  <ImageUploadField value={photoUrl} onChange={setPhotoUrl} folder="equipe" />
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
  <div className="flex gap-2">
  <input
  placeholder="Nom"
  className="min-w-0 flex-1 rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("nom")}
  />
  <input
  placeholder="Fonction"
  className="min-w-0 flex-1 rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("fonction")}
  />
  </div>
  <textarea
  rows={2}
  placeholder="Bio"
  className="w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("bio")}
  />
  <button
  type="submit"
  disabled={isSubmitting}
  className="rounded-full bg-primrose-green-dark px-4 py-1.5 text-xs font-medium text-primrose-white hover:bg-primrose-green-dark/90 disabled:opacity-60"
  >
  {isSubmitting ? "Enregistrement…" : "Enregistrer"}
  </button>
  </form>
  <div className="flex flex-col items-end gap-2">
  <ToggleSwitch checked={membre.actif} onToggle={(next) => toggleMembreEquipeActif(membre.id, next)} />
  <RowActions itemLabel={membre.nom} onDelete={() => deleteMembreEquipe(membre.id)} />
  </div>
  </div>
  );
}
