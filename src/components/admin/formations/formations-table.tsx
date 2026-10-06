"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { AdminDataTable } from "@/components/admin/data-table";
import { createAdminColumnHelper } from "@/components/admin/table-features";
import { RowActions } from "@/components/admin/row-actions";
import { Modal } from "@/components/admin/modal";
import { Link } from "@/i18n/navigation";
import { FormationForm } from "@/components/admin/formations/formation-form";
import { deleteFormation } from "@/actions/admin/formations";
import type { Database } from "@/types/database";

type Formation = Database["public"]["Tables"]["formations"]["Row"];

const helper = createAdminColumnHelper<Formation>();

const STATUT_LABELS: Record<Formation["statut"], string> = {
  brouillon: "Brouillon",
  ouverte: "Ouverte",
  complete: "Complet",
  terminee: "Terminée",
};

export function FormationsTable({ formations }: { formations: Formation[] }) {
  const [editing, setEditing] = useState<Formation | null>(null);
  const [creating, setCreating] = useState(false);

  const columns = [
    helper.accessor("titre", { header: "Titre" }),
    helper.accessor((row) => STATUT_LABELS[row.statut], {
      id: "statut",
      header: "Statut",
    }),
    helper.accessor("lieu", { header: "Lieu" }),
    helper.accessor("places", { header: "Places" }),
    helper.display({
      id: "inscriptions",
      header: "Inscriptions",
      cell: ({ row }) => (
        <Link
          href={`/admin/formations/${row.original.id}/inscriptions`}
          className="inline-flex items-center gap-1 text-xs font-medium text-primrose-green-dark hover:underline"
        >
          <Users className="h-3.5 w-3.5" aria-hidden />
          Voir
        </Link>
      ),
    }),
    helper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <RowActions
          itemLabel={row.original.titre}
          onEdit={() => setEditing(row.original)}
          onDelete={() => deleteFormation(row.original.id)}
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
          + Nouvelle formation
        </button>
      </div>

      <div className="mt-4">
        <AdminDataTable data={formations} columns={columns} searchPlaceholder="Rechercher une formation…" />
      </div>

      <Modal open={creating} onOpenChange={setCreating} title="Nouvelle formation">
        <FormationForm onSaved={() => setCreating(false)} />
      </Modal>

      <Modal open={!!editing} onOpenChange={(open) => !open && setEditing(null)} title="Modifier la formation">
        {editing && <FormationForm formation={editing} onSaved={() => setEditing(null)} />}
      </Modal>
    </div>
  );
}
