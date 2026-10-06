"use client";

import { AlertDialog } from "radix-ui";
import { cn } from "@/lib/utils";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  destructive = true,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-primrose-ink/40" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-card bg-primrose-white p-6 shadow-card">
          <AlertDialog.Title className="font-serif text-lg text-primrose-green-dark">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-primrose-ink/80">
            {description}
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                className="rounded-full border border-primrose-ink/15 px-4 py-2 text-sm font-medium text-primrose-ink hover:bg-primrose-cream"
              >
                {cancelLabel}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                onClick={onConfirm}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-primrose-white",
                  destructive
                    ? "bg-primrose-alert hover:bg-primrose-alert/90"
                    : "bg-primrose-green-dark hover:bg-primrose-green-dark/90"
                )}
              >
                {confirmLabel}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
