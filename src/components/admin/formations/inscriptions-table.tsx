"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { AdminDataTable } from "@/components/admin/data-table";
import { createAdminColumnHelper } from "@/components/admin/table-features";
import { updateInscriptionStatut } from "@/actions/admin/formations";
import { toCsv, downloadCsv } from "@/lib/csv";
import type { Database } from "@/types/database";

type Inscription = Database["public"]["Tables"]["formation_inscriptions"]["Row"];

const helper = createAdminColumnHelper<Inscription>();

const STATUTS = ["en_attente", "acceptee", "refusee"] as const;
const STATUT_LABELS: Record<(typeof STATUTS)[number], string> = {
  en_attente: "En attente",
  acceptee: "Acceptée",
  refusee: "Refusée",
};

function StatutSelect({ inscription }: { inscription: Inscription }) {
  const [isPending, startTransition] = useTransition();

  function onChange(statut: (typeof STATUTS)[number]) {
    startTransition(async () => {
      const result = await updateInscriptionStatut(inscription.id, statut);
      if (result?.error) toast.error(result.error);
      else toast.success("Statut mis à jour.");
    });
  }

  return (
    <select
      value={inscription.statut}
      disabled={isPending}
      onChange={(e) => onChange(e.target.value as (typeof STATUTS)[number])}
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

export function InscriptionsTable({
  inscriptions,
  formationTitre,
}: {
  inscriptions: Inscription[];
  formationTitre: string;
}) {
  const columns = [
    helper.accessor("nom", { header: "Nom" }),
    helper.accessor("email", { header: "E-mail" }),
    helper.accessor("telephone", { header: "Téléphone" }),
    helper.accessor((row) => new Date(row.created_at).toLocaleDateString("fr-FR"), {
      id: "date",
      header: "Reçue le",
    }),
    helper.display({
      id: "statut",
      header: "Statut",
      cell: ({ row }) => <StatutSelect inscription={row.original} />,
    }),
  ];

  function handleExport() {
    const csv = toCsv(inscriptions, [
      { key: "nom", label: "Nom" },
      { key: "email", label: "E-mail" },
      { key: "telephone", label: "Téléphone" },
      { key: "message", label: "Message" },
      { key: "statut", label: "Statut" },
      { key: "created_at", label: "Reçue le" },
    ]);
    downloadCsv(`inscriptions-${formationTitre}.csv`, csv);
  }

  return (
    <div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-full border border-primrose-green-dark px-4 py-2 text-sm font-medium text-primrose-green-dark hover:bg-primrose-cream"
        >
          <Download className="h-4 w-4" aria-hidden />
          Exporter en CSV
        </button>
      </div>
      <div className="mt-4">
        <AdminDataTable
          data={inscriptions}
          columns={columns}
          searchPlaceholder="Rechercher une inscription…"
          emptyMessage="Aucune inscription pour le moment."
        />
      </div>
    </div>
  );
}
