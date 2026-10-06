"use client";

import { useTable, type ColumnDef, type RowData } from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { adminTableFeatures } from "./table-features";
import { cn } from "@/lib/utils";

export function AdminDataTable<TData extends RowData>({
  data,
  columns,
  searchPlaceholder = "Rechercher…",
  emptyMessage = "Aucun résultat.",
}: {
  data: TData[];
  // `any` ici est la valeur de colonne (TValue), volontairement non unifiée :
  // chaque colonne d'un tableau a un type de cellule différent (string, number,
  // ReactNode...), donc le tableau hétérogène de colonnes ne peut pas être
  // typé par une seule TValue concrète — c'est l'usage documenté de TanStack
  // Table pour un composant de tableau générique.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<typeof adminTableFeatures, TData, any>[];
  searchPlaceholder?: string;
  emptyMessage?: string;
}) {
  const table = useTable({
    features: adminTableFeatures,
    columns,
    data,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  return (
    <div>
      <input
        value={table.state.globalFilter ?? ""}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        placeholder={searchPlaceholder}
        className="field-input max-w-sm rounded-full px-4 py-2.5 text-sm"
      />

      <div className="mt-5 overflow-x-auto rounded-2xl border border-primrose-ink/10 bg-primrose-white shadow-[0_18px_40px_-28px_rgba(58,46,42,0.35)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-primrose-cream/70 text-[11px] font-semibold uppercase tracking-[0.12em] text-primrose-forest">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th key={header.id} className="px-4 py-3 font-medium">
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          disabled={!canSort}
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            "flex items-center gap-1 [color:inherit]",
                            canSort && "cursor-pointer hover:text-primrose-ink"
                          )}
                        >
                          <table.FlexRender header={header} />
                          {canSort &&
                            (sorted === "asc" ? (
                              <ChevronUp className="h-3.5 w-3.5" aria-hidden />
                            ) : sorted === "desc" ? (
                              <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                            ) : (
                              <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" aria-hidden />
                            ))}
                        </button>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-primrose-ink/60"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-primrose-ink/5 transition-colors last:border-0 hover:bg-primrose-cream/40">
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-middle">
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-primrose-ink/70">
        <p>
          Page {table.state.pagination.pageIndex + 1} sur{" "}
          {Math.max(1, table.getPageCount())}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-primrose-ink/15 disabled:opacity-30"
            aria-label="Page précédente"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-primrose-ink/15 disabled:opacity-30"
            aria-label="Page suivante"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
