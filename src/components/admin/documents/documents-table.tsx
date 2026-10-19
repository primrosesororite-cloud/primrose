"use client";

import { useState } from "react";
import { ExternalLink, Plus } from "lucide-react";
import { AdminDataTable } from "@/components/admin/data-table";
import { createAdminColumnHelper } from "@/components/admin/table-features";
import { RowActions } from "@/components/admin/row-actions";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { Modal } from "@/components/admin/modal";
import { DocumentForm } from "@/components/admin/documents/document-form";
import { CATEGORIE_LABELS } from "@/components/admin/documents/categorie-labels";
import { deleteDocument, toggleDocumentPublie } from "@/actions/admin/documents";
import { formatTaille } from "@/lib/format";
import { Link } from "@/i18n/navigation";
import type { Database } from "@/types/database";

type Document = Database["public"]["Tables"]["documents"]["Row"];

const helper = createAdminColumnHelper<Document>();

export function DocumentsTable({ documents }: { documents: Document[] }) {
  const [editing, setEditing] = useState<Document | null>(null);
  const [creating, setCreating] = useState(false);

  const columns = [
    helper.accessor("titre", { header: "Titre" }),
    helper.accessor((row) => CATEGORIE_LABELS[row.categorie], { id: "categorie", header: "Catégorie" }),
    helper.accessor((row) => (row.taille_octets !== null ? formatTaille(row.taille_octets) : "—"), {
      id: "taille",
      header: "Taille",
    }),
    helper.accessor(
      (row) => (row.date_publication ? new Date(row.date_publication).toLocaleDateString("fr-FR") : "—"),
      { id: "date_publication", header: "Date" }
    ),
    helper.display({
      id: "publie",
      header: "Statut",
      cell: ({ row }) => (
        <ToggleSwitch
          checked={row.original.publie}
          labelOn="Publié"
          labelOff="Brouillon"
          onToggle={(next) => toggleDocumentPublie(row.original.id, next)}
        />
      ),
    }),
    helper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {row.original.publie && (
            <Link
              href={`/documents/${row.original.slug}`}
              target="_blank"
              aria-label={`Voir « ${row.original.titre} » sur le site`}
              className="flex h-8 w-8 items-center justify-center rounded-full text-primrose-ink/60 hover:bg-primrose-cream hover:text-primrose-ink"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
            </Link>
          )}
          <RowActions
            itemLabel={row.original.titre}
            onEdit={() => setEditing(row.original)}
            onDelete={() => deleteDocument(row.original.id)}
          />
        </div>
      ),
    }),
  ];

  return (
    <div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-primrose-green-dark px-4 py-2 text-sm font-medium text-primrose-white hover:bg-primrose-green-dark/90"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Ajouter un document
        </button>
      </div>

      <div className="mt-4">
        <AdminDataTable
          data={documents}
          columns={columns}
          searchPlaceholder="Rechercher un document…"
          emptyMessage="Aucun document pour le moment. Ajoutez votre premier PDF."
        />
      </div>

      <Modal open={creating} onOpenChange={setCreating} title="Ajouter un document" wide>
        <DocumentForm onSaved={() => setCreating(false)} />
      </Modal>

      <Modal open={!!editing} onOpenChange={(open) => !open && setEditing(null)} title="Modifier le document" wide>
        {editing && <DocumentForm document={editing} onSaved={() => setEditing(null)} />}
      </Modal>
    </div>
  );
}
