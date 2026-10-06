"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { visionSchema, type VisionInput } from "@/lib/validations/admin/contenus";
import { updateVision } from "@/actions/admin/contenus";

export function VisionForm({ defaultValues }: { defaultValues: VisionInput }) {
  const [isPending, startTransition] = useTransition();
  const {
  register,
  handleSubmit,
  formState: { errors },
  } = useForm<VisionInput>({
  resolver: zodResolver(visionSchema),
  defaultValues,
  });

  function onSubmit(values: VisionInput) {
  startTransition(async () => {
  const fd = new FormData();
  fd.set("titre", values.titre);
  fd.set("texte", values.texte);
  const result = await updateVision(fd);
  if (result?.error) toast.error(result.error);
  else toast.success("Vision mise à jour.");
  });
  }

  return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  <div>
  <label htmlFor="titre" className="text-sm font-medium text-primrose-ink">
  Titre
  </label>
  <input
  id="titre"
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 bg-primrose-white px-3 py-2 text-sm"
  {...register("titre")}
  />
  {errors.titre && (
  <p className="mt-1 text-sm text-primrose-alert">Ce champ est requis.</p>
  )}
  </div>
  <div>
  <label htmlFor="texte" className="text-sm font-medium text-primrose-ink">
  Texte
  </label>
  <textarea
  id="texte"
  rows={4}
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 bg-primrose-white px-3 py-2 text-sm"
  {...register("texte")}
  />
  {errors.texte && (
  <p className="mt-1 text-sm text-primrose-alert">Ce champ est requis.</p>
  )}
  </div>
  <button
  type="submit"
  disabled={isPending}
  className="rounded-full bg-primrose-green-dark px-5 py-2.5 text-sm font-medium text-primrose-white hover:bg-primrose-green-dark/90 disabled:opacity-60"
  >
  {isPending ? "Enregistrement…" : "Enregistrer"}
  </button>
  </form>
  );
}
