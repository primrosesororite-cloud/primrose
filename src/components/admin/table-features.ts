import {
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  createFilteredRowModel,
  filterFn_includesString,
  rowSortingFeature,
  createSortedRowModel,
  sortFn_alphanumeric,
  sortFn_text,
  sortFn_datetime,
  rowPaginationFeature,
  createPaginatedRowModel,
  createColumnHelper,
  type RowData,
} from "@tanstack/react-table";

/**
 * Jeu de fonctionnalités TanStack Table v9 partagé par tous les tableaux
 * d'administration : recherche globale, tri, pagination. Un seul `features`
 * partagé est nécessaire car les colonnes de chaque module sont typées
 * contre lui (voir `createAdminColumnHelper`).
 */
export const adminTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text, datetime: sortFn_datetime },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

export function createAdminColumnHelper<TData extends RowData>() {
  return createColumnHelper<typeof adminTableFeatures, TData>();
}
