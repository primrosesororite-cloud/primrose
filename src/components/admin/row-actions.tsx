"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

export function RowActions({
  onEdit,
  onDelete,
  itemLabel,
}: {
  onEdit?: () => void;
  onDelete?: () => Promise<{ error?: string } | void>;
  itemLabel: string;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
  if (!onDelete) return;
  startTransition(async () => {
  const result = await onDelete();
  if (result?.error) {
  toast.error(result.error);
  } else {
  toast.success("Supprimé.");
  }
  setConfirmOpen(false);
  });
  }

  return (
  <div className="flex items-center gap-1">
  {onEdit && (
  <button
  type="button"
  onClick={onEdit}
  aria-label={`Modifier ${itemLabel}`}
  className="flex h-8 w-8 items-center justify-center rounded-full text-primrose-ink/60 hover:bg-primrose-cream hover:text-primrose-ink"
  >
  <Pencil className="h-4 w-4" aria-hidden />
  </button>
  )}
  {onDelete && (
  <>
  <button
  type="button"
  onClick={() => setConfirmOpen(true)}
  aria-label={`Supprimer ${itemLabel}`}
  className="flex h-8 w-8 items-center justify-center rounded-full text-primrose-alert/70 hover:bg-primrose-alert/10 hover:text-primrose-alert"
  >
  <Trash2 className="h-4 w-4" aria-hidden />
  </button>
  <ConfirmDialog
  open={confirmOpen}
  onOpenChange={setConfirmOpen}
  title="Confirmer la suppression"
  description={`Voulez-vous vraiment supprimer « ${itemLabel} » ? Cette action est irréversible.`}
  confirmLabel={isPending ? "Suppression…" : "Supprimer"}
  onConfirm={handleDelete}
  />
  </>
  )}
  </div>
  );
}
