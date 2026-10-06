"use client";

import { AdminDataTable } from "@/components/admin/data-table";
import { createAdminColumnHelper } from "@/components/admin/table-features";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type AuditEntry = Database["public"]["Tables"]["audit_logs"]["Row"] & {
  userName: string;
};

const helper = createAdminColumnHelper<AuditEntry>();

const ACTION_STYLES: Record<string, string> = {
  INSERT: "bg-primrose-green/15 text-primrose-green-dark",
  UPDATE: "bg-primrose-cream text-primrose-ink",
  DELETE: "bg-primrose-alert/15 text-primrose-alert",
  READ: "bg-primrose-ink/10 text-primrose-ink/70",
};

export function AuditTable({ entries }: { entries: AuditEntry[] }) {
  const columns = [
    helper.accessor((row) => new Date(row.created_at).toLocaleString("fr-FR"), {
      id: "date",
      header: "Date",
    }),
    helper.accessor("userName", { header: "Utilisateur" }),
    helper.accessor("action", {
      header: "Action",
      cell: ({ getValue }) => (
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-medium",
            ACTION_STYLES[getValue()] ?? "bg-primrose-ink/10 text-primrose-ink/70"
          )}
        >
          {getValue()}
        </span>
      ),
    }),
    helper.accessor("table_name", { header: "Table" }),
    helper.accessor("record_id", { header: "Enregistrement" }),
  ];

  return (
    <AdminDataTable
      data={entries}
      columns={columns}
      searchPlaceholder="Rechercher…"
      emptyMessage="Aucune entrée dans le journal."
    />
  );
}
