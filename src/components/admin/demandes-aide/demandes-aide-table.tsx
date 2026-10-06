"use client";

import { AdminDataTable } from "@/components/admin/data-table";
import { createAdminColumnHelper } from "@/components/admin/table-features";
import { Link } from "@/i18n/navigation";
import { Eye } from "lucide-react";
import type { Database, RequestStatus, UrgencyLevel } from "@/types/database";

type DemandeRow = Pick<
  Database["public"]["Tables"]["demandes_aide"]["Row"],
"id" | "moyen_contact" | "urgence" | "statut" | "assignee_id" | "created_at"
>;

const helper = createAdminColumnHelper<DemandeRow>();

const URGENCE_LABELS: Record<UrgencyLevel, string> = {
  normal: "Normal",
  important: "Important",
  urgent: "Urgent",
};

const STATUT_LABELS: Record<RequestStatus, string> = {
  nouveau: "Nouveau",
  en_cours: "En cours",
  traite: "Traité",
  archive: "Archivé",
};

const MOYEN_LABELS: Record<DemandeRow["moyen_contact"], string> = {
  telephone: "Téléphone",
  whatsapp: "WhatsApp",
  email: "E-mail",
};

export function DemandesAideTable({ demandes }: { demandes: DemandeRow[] }) {
  const columns = [
  helper.accessor((row) => new Date(row.created_at).toLocaleString("fr-FR"), {
  id: "date",
  header: "Reçue le",
  }),
  helper.accessor((row) => MOYEN_LABELS[row.moyen_contact], {
  id: "moyen_contact",
  header: "Moyen de contact",
  }),
  helper.accessor((row) => URGENCE_LABELS[row.urgence], {
  id: "urgence",
  header: "Urgence",
  cell: ({ row }) => (
  <span
  className={
  row.original.urgence === "urgent"
  ? "rounded-full bg-primrose-alert/15 px-2 py-1 text-xs font-medium text-primrose-alert"
  : "text-sm text-primrose-ink/80"
  }
  >
  {URGENCE_LABELS[row.original.urgence]}
  </span>
  ),
  }),
  helper.accessor((row) => STATUT_LABELS[row.statut], { id: "statut", header: "Statut" }),
  helper.accessor((row) => (row.assignee_id ? "Assignée" : "—"), {
  id: "assignee",
  header: "Suivi",
  }),
  helper.display({
  id: "actions",
  header: "",
  cell: ({ row }) => (
  <Link
  href={`/admin/demandes-aide/${row.original.id}`}
  className="inline-flex items-center gap-1 text-xs font-medium text-primrose-green-dark hover:underline"
  >
  <Eye className="h-3.5 w-3.5" aria-hidden />
  Voir
  </Link>
  ),
  }),
  ];

  return (
  <AdminDataTable
  data={demandes}
  columns={columns}
  searchPlaceholder="Rechercher…"
  emptyMessage="Aucune demande d'aide."
  />
  );
}
