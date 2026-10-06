"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AdminDataTable } from "@/components/admin/data-table";
import { createAdminColumnHelper } from "@/components/admin/table-features";
import { RowActions } from "@/components/admin/row-actions";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { Modal } from "@/components/admin/modal";
import { chiffreCleSchema, type ChiffreCleInput } from "@/lib/validations/admin/contenus";
import {
  createChiffreCle,
  updateChiffreCle,
  deleteChiffreCle,
  toggleChiffreCleActif,
} from "@/actions/admin/contenus";
import type { Database } from "@/types/database";

type ChiffreCle = Database["public"]["Tables"]["chiffres_cles"]["Row"];

const helper = createAdminColumnHelper<ChiffreCle>();

function ChiffreForm({
  chiffre,
  onSaved,
}: {
  chiffre?: ChiffreCle;
  onSaved: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ChiffreCleInput>({
    resolver: zodResolver(chiffreCleSchema),
    defaultValues: chiffre
      ? {
          libelle: chiffre.libelle,
          valeur: chiffre.valeur,
          suffixe: chiffre.suffixe,
          ordre: chiffre.ordre,
        }
      : { libelle: "", valeur: 0, suffixe: "", ordre: 0 },
  });

  async function onSubmit(values: ChiffreCleInput) {
    const fd = new FormData();
    fd.set("libelle", values.libelle);
    fd.set("valeur", String(values.valeur));
    fd.set("suffixe", values.suffixe ?? "");
    fd.set("ordre", String(values.ordre));

    const result = chiffre
      ? await updateChiffreCle(chiffre.id, fd)
      : await createChiffreCle(fd);

    if (result?.error) toast.error(result.error);
    else {
      toast.success(chiffre ? "Chiffre mis à jour." : "Chiffre créé.");
      onSaved();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-primrose-ink">Libellé</label>
        <input
          className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
          {...register("libelle")}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-sm font-medium text-primrose-ink">Valeur</label>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
            {...register("valeur", { valueAsNumber: true })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-primrose-ink">Suffixe</label>
          <input
            className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
            {...register("suffixe")}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-primrose-ink">Ordre</label>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
            {...register("ordre", { valueAsNumber: true })}
          />
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

export function ChiffresTable({ chiffres }: { chiffres: ChiffreCle[] }) {
  const [editing, setEditing] = useState<ChiffreCle | null>(null);
  const [creating, setCreating] = useState(false);

  const columns = [
    helper.accessor("libelle", { header: "Libellé" }),
    helper.accessor((row) => `${row.valeur}${row.suffixe ?? ""}`, {
      id: "valeur",
      header: "Valeur",
    }),
    helper.accessor("ordre", { header: "Ordre" }),
    helper.display({
      id: "actif",
      header: "Statut",
      cell: ({ row }) => (
        <ToggleSwitch
          checked={row.original.actif}
          onToggle={(next) => toggleChiffreCleActif(row.original.id, next)}
        />
      ),
    }),
    helper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <RowActions
          itemLabel={row.original.libelle}
          onEdit={() => setEditing(row.original)}
          onDelete={() => deleteChiffreCle(row.original.id)}
        />
      ),
    }),
  ];

  return (
    <div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-full bg-primrose-green-dark px-4 py-2 text-sm font-medium text-primrose-white hover:bg-primrose-green-dark/90"
        >
          + Ajouter un chiffre
        </button>
      </div>

      <div className="mt-4">
        <AdminDataTable data={chiffres} columns={columns} searchPlaceholder="Rechercher un chiffre…" />
      </div>

      <Modal open={creating} onOpenChange={setCreating} title="Nouveau chiffre clé">
        <ChiffreForm onSaved={() => setCreating(false)} />
      </Modal>

      <Modal open={!!editing} onOpenChange={(open) => !open && setEditing(null)} title="Modifier le chiffre">
        {editing && <ChiffreForm chiffre={editing} onSaved={() => setEditing(null)} />}
      </Modal>
    </div>
  );
}
