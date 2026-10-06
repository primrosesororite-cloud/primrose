"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Eye } from "lucide-react";
import { AdminDataTable } from "@/components/admin/data-table";
import { createAdminColumnHelper } from "@/components/admin/table-features";
import { ReplyButton } from "@/components/admin/reply-button";
import { Modal } from "@/components/admin/modal";
import { updateAdhesionStatut } from "@/actions/admin/demandes";
import type { Database, RequestStatus } from "@/types/database";

type Adhesion = Database["public"]["Tables"]["membres_demandes"]["Row"];

const helper = createAdminColumnHelper<Adhesion>();

const STATUTS: RequestStatus[] = ["nouveau", "en_cours", "traite", "archive"];
const STATUT_LABELS: Record<RequestStatus, string> = {
  nouveau: "Nouveau",
  en_cours: "En cours",
  traite: "Traité",
  archive: "Archivé",
};

const TYPE_LABELS: Record<Adhesion["type"], string> = {
  membre: "Membre",
  benevole: "Bénévole",
  partenaire: "Partenaire",
  donateur: "Donateur",
};

function StatutSelect({ adhesion }: { adhesion: Adhesion }) {
  const [isPending, startTransition] = useTransition();

  function onChange(statut: RequestStatus) {
  startTransition(async () => {
  const result = await updateAdhesionStatut(adhesion.id, statut);
  if (result?.error) toast.error(result.error);
  });
  }

  return (
  <select
  value={adhesion.statut}
  disabled={isPending}
  onChange={(e) => onChange(e.target.value as RequestStatus)}
  className="rounded-full border border-primrose-ink/15 bg-primrose-white px-2 py-1 text-xs disabled:opacity-50"
  >
  {STATUTS.map((s) => (
  <option key={s} value={s}>
  {STATUT_LABELS[s]}
  </option>
  ))}
  </select>
  );
}

function DetailButton({ adhesion }: { adhesion: Adhesion }) {
  const [open, setOpen] = useState(false);
  return (
  <>
  <button
  type="button"
  onClick={() => setOpen(true)}
  aria-label="Voir le détail"
  className="flex h-8 w-8 items-center justify-center rounded-full text-primrose-ink/60 hover:bg-primrose-cream hover:text-primrose-ink"
  >
  <Eye className="h-4 w-4" aria-hidden />
  </button>
  <Modal open={open} onOpenChange={setOpen} title={adhesion.nom}>
  <dl className="space-y-2 text-sm">
  <div>
  <dt className="text-xs text-primrose-ink/70">Profil</dt>
  <dd>{TYPE_LABELS[adhesion.type]}</dd>
  </div>
  <div>
  <dt className="text-xs text-primrose-ink/70">E-mail</dt>
  <dd>{adhesion.email}</dd>
  </div>
  {adhesion.telephone && (
  <div>
  <dt className="text-xs text-primrose-ink/70">Téléphone</dt>
  <dd>{adhesion.telephone}</dd>
  </div>
  )}
  {adhesion.ville && (
  <div>
  <dt className="text-xs text-primrose-ink/70">Ville</dt>
  <dd>{adhesion.ville}</dd>
  </div>
  )}
  {adhesion.motivation && (
  <div>
  <dt className="text-xs text-primrose-ink/70">Motivation</dt>
  <dd className="whitespace-pre-wrap">{adhesion.motivation}</dd>
  </div>
  )}
  </dl>
  </Modal>
  </>
  );
}

export function AdhesionsTable({ adhesions }: { adhesions: Adhesion[] }) {
  const columns = [
  helper.accessor("nom", { header: "Nom" }),
  helper.accessor((row) => TYPE_LABELS[row.type], { id: "type", header: "Profil" }),
  helper.accessor("email", { header: "E-mail" }),
  helper.accessor("ville", { header: "Ville" }),
  helper.accessor((row) => new Date(row.created_at).toLocaleDateString("fr-FR"), {
  id: "date",
  header: "Reçue le",
  }),
  helper.display({
  id: "statut",
  header: "Statut",
  cell: ({ row }) => <StatutSelect adhesion={row.original} />,
  }),
  helper.display({
  id: "actions",
  header: "",
  cell: ({ row }) => (
  <div className="flex items-center gap-1">
  <DetailButton adhesion={row.original} />
  <ReplyButton to={row.original.email} defaultSubject="Votre demande auprès de Primrose" />
  </div>
  ),
  }),
  ];

  return (
  <AdminDataTable
  data={adhesions}
  columns={columns}
  searchPlaceholder="Rechercher une demande…"
  emptyMessage="Aucune demande d'adhésion."
  />
  );
}
