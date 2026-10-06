"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { RowActions } from "@/components/admin/row-actions";
import { partenaireSchema, type PartenaireInput } from "@/lib/validations/admin/equipe";
import {
  updatePartenaire,
  deletePartenaire,
  togglePartenaireActif,
} from "@/actions/admin/equipe";
import type { Database } from "@/types/database";

type Partenaire = Database["public"]["Tables"]["partenaires"]["Row"];

export function PartenaireCard({ partenaire }: { partenaire: Partenaire }) {
  const [logoUrl, setLogoUrl] = useState<string | null>(partenaire.logo_url);
  const {
  register,
  handleSubmit,
  formState: { isSubmitting, errors },
  } = useForm<PartenaireInput>({
  resolver: zodResolver(partenaireSchema),
  defaultValues: { nom: partenaire.nom, lien: partenaire.lien ?? "" },
  });

  async function onSubmit(values: PartenaireInput) {
  const fd = new FormData();
  fd.set("nom", values.nom);
  fd.set("lien", values.lien ?? "");
  const result = await updatePartenaire(partenaire.id, logoUrl, fd);
  if (result?.error) toast.error(result.error);
  else toast.success("Partenaire mis à jour.");
  }

  return (
  <div className="grid grid-cols-[96px_1fr_auto] items-start gap-4">
  <ImageUploadField value={logoUrl} onChange={setLogoUrl} folder="partenaires" />
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
  <input
  placeholder="Nom"
  className="w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("nom")}
  />
  <input
  placeholder="Lien (https://…)"
  className="w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("lien")}
  />
  {errors.lien && <p className="text-xs text-primrose-alert">URL invalide.</p>}
  <button
  type="submit"
  disabled={isSubmitting}
  className="rounded-full bg-primrose-green-dark px-4 py-1.5 text-xs font-medium text-primrose-white hover:bg-primrose-green-dark/90 disabled:opacity-60"
  >
  {isSubmitting ? "Enregistrement…" : "Enregistrer"}
  </button>
  </form>
  <div className="flex flex-col items-end gap-2">
  <ToggleSwitch
  checked={partenaire.actif}
  onToggle={(next) => togglePartenaireActif(partenaire.id, next)}
  />
  <RowActions itemLabel={partenaire.nom} onDelete={() => deletePartenaire(partenaire.id)} />
  </div>
  </div>
  );
}
