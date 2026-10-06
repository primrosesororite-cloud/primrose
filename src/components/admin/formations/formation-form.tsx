"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { formationSchema, type FormationInput } from "@/lib/validations/admin/formations";
import { createFormation, updateFormation } from "@/actions/admin/formations";
import type { Database } from "@/types/database";

type Formation = Database["public"]["Tables"]["formations"]["Row"];

const STATUTS = ["brouillon", "ouverte", "complete", "terminee"] as const;

export function FormationForm({
  formation,
  onSaved,
}: {
  formation?: Formation;
  onSaved: () => void;
}) {
  const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  } = useForm<FormationInput>({
  resolver: zodResolver(formationSchema),
  defaultValues: formation
  ? {
  slug: formation.slug,
  titre: formation.titre,
  description: formation.description ?? "",
  public_cible: formation.public_cible ?? "",
  date_debut: formation.date_debut ? formation.date_debut.slice(0, 10) : "",
  lieu: formation.lieu ?? "",
  places: formation.places ?? undefined,
  statut: formation.statut,
  }
  : { slug: "", titre: "", description: "", public_cible: "", date_debut: "", lieu: "", statut: "brouillon" },
  });

  async function onSubmit(values: FormationInput) {
  const fd = new FormData();
  fd.set("slug", values.slug);
  fd.set("titre", values.titre);
  fd.set("description", values.description ?? "");
  fd.set("public_cible", values.public_cible ?? "");
  fd.set("date_debut", values.date_debut ?? "");
  fd.set("lieu", values.lieu ?? "");
  fd.set("places", values.places != null ? String(values.places) : "");
  fd.set("statut", values.statut);

  const result = formation
  ? await updateFormation(formation.id, fd)
  : await createFormation(fd);

  if (result?.error) toast.error(result.error);
  else {
  toast.success(formation ? "Formation mise à jour." : "Formation créée.");
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
  <label className="text-sm font-medium text-primrose-ink">Description</label>
  <textarea
  rows={3}
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("description")}
  />
  </div>

  <div className="grid grid-cols-2 gap-3">
  <div>
  <label className="text-sm font-medium text-primrose-ink">Public cible</label>
  <input
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("public_cible")}
  />
  </div>
  <div>
  <label className="text-sm font-medium text-primrose-ink">Lieu</label>
  <input
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("lieu")}
  />
  </div>
  <div>
  <label className="text-sm font-medium text-primrose-ink">Date de début</label>
  <input
  type="date"
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("date_debut")}
  />
  </div>
  <div>
  <label className="text-sm font-medium text-primrose-ink">Places</label>
  <input
  type="number"
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("places", { valueAsNumber: true })}
  />
  </div>
  </div>

  <div>
  <label className="text-sm font-medium text-primrose-ink">Statut</label>
  <select
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("statut")}
  >
  {STATUTS.map((s) => (
  <option key={s} value={s}>
  {s}
  </option>
  ))}
  </select>
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
