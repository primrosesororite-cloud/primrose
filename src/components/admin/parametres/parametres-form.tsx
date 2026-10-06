"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { parametresSchema, type ParametresInput } from "@/lib/validations/admin/parametres";
import { updateParametres } from "@/actions/admin/parametres";

export function ParametresForm({ defaultValues }: { defaultValues: ParametresInput }) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParametresInput>({ resolver: zodResolver(parametresSchema), defaultValues });

  function onSubmit(values: ParametresInput) {
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => fd.set(k, v ?? ""));
      const result = await updateParametres(fd);
      if (result?.error) toast.error(result.error);
      else toast.success("Paramètres mis à jour.");
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-primrose-ink">Nom de l&apos;association</label>
        <input
          className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
          {...register("nom")}
        />
        {errors.nom && <p className="mt-1 text-xs text-primrose-alert">Requis.</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-primrose-ink">Slogan</label>
        <input
          className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
          {...register("slogan")}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-primrose-ink">E-mail de contact</label>
          <input
            className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
            {...register("email")}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-primrose-ink">Téléphone</label>
          <input
            className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
            {...register("telephone")}
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-primrose-ink">Adresse</label>
        <input
          className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
          {...register("adresse")}
        />
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
