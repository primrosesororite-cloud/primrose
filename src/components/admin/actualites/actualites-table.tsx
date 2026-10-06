"use client";

import { useState } from "react";
import { AdminDataTable } from "@/components/admin/data-table";
import { createAdminColumnHelper } from "@/components/admin/table-features";
import { RowActions } from "@/components/admin/row-actions";
import { Modal } from "@/components/admin/modal";
import { ActualiteForm } from "@/components/admin/actualites/actualite-form";
import { deleteActualite } from "@/actions/admin/actualites";
import type { Database } from "@/types/database";

type Actualite = Database["public"]["Tables"]["actualites"]["Row"];

const helper = createAdminColumnHelper<Actualite>();

export function ActualitesTable({ actualites }: { actualites: Actualite[] }) {
  const [editing, setEditing] = useState<Actualite | null>(null);
  const [creating, setCreating] = useState(false);

  const columns = [
  helper.accessor("titre", { header: "Titre" }),
  helper.accessor((row) => (row.publie ? "Publié" : "Brouillon"), {
  id: "publie",
  header: "Statut",
  }),
  helper.accessor(
  (row) => (row.date_publication ? new Date(row.date_publication).toLocaleDateString("fr-FR") : "—"),
  { id: "date_publication", header: "Publication" }
  ),
  helper.display({
  id: "actions",
  header: "",
  cell: ({ row }) => (
  <RowActions
  itemLabel={row.original.titre}
  onEdit={() => setEditing(row.original)}
  onDelete={() => deleteActualite(row.original.id)}
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
  + Nouvel article
  </button>
  </div>

  <div className="mt-4">
  <AdminDataTable data={actualites} columns={columns} searchPlaceholder="Rechercher un article…" />
  </div>

  <Modal open={creating} onOpenChange={setCreating} title="Nouvel article" wide>
  <ActualiteForm onSaved={() => setCreating(false)} />
  </Modal>

  <Modal open={!!editing} onOpenChange={(open) => !open && setEditing(null)} title="Modifier l'article" wide>
  {editing && <ActualiteForm actualite={editing} onSaved={() => setEditing(null)} />}
  </Modal>
  </div>
  );
}
