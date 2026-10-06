"use client";

import { useState } from "react";
import { AdminDataTable } from "@/components/admin/data-table";
import { createAdminColumnHelper } from "@/components/admin/table-features";
import { RowActions } from "@/components/admin/row-actions";
import { Modal } from "@/components/admin/modal";
import { EvenementForm } from "@/components/admin/evenements/evenement-form";
import { deleteEvenement } from "@/actions/admin/actualites";
import type { Database } from "@/types/database";

type Evenement = Database["public"]["Tables"]["evenements"]["Row"];

const helper = createAdminColumnHelper<Evenement>();

export function EvenementsTable({ evenements }: { evenements: Evenement[] }) {
  const [editing, setEditing] = useState<Evenement | null>(null);
  const [creating, setCreating] = useState(false);

  const columns = [
    helper.accessor("titre", { header: "Titre" }),
    helper.accessor((row) => new Date(row.date_evenement).toLocaleString("fr-FR"), {
      id: "date_evenement",
      header: "Date",
    }),
    helper.accessor("lieu", { header: "Lieu" }),
    helper.accessor((row) => (row.publie ? "Publié" : "Brouillon"), {
      id: "publie",
      header: "Statut",
    }),
    helper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <RowActions
          itemLabel={row.original.titre}
          onEdit={() => setEditing(row.original)}
          onDelete={() => deleteEvenement(row.original.id)}
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
          + Nouvel événement
        </button>
      </div>

      <div className="mt-4">
        <AdminDataTable data={evenements} columns={columns} searchPlaceholder="Rechercher un événement…" />
      </div>

      <Modal open={creating} onOpenChange={setCreating} title="Nouvel événement">
        <EvenementForm onSaved={() => setCreating(false)} />
      </Modal>

      <Modal open={!!editing} onOpenChange={(open) => !open && setEditing(null)} title="Modifier l'événement">
        {editing && <EvenementForm evenement={editing} onSaved={() => setEditing(null)} />}
      </Modal>
    </div>
  );
}
