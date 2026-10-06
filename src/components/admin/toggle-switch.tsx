"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ToggleSwitch({
  checked,
  onToggle,
  labelOn = "Actif",
  labelOff = "Inactif",
}: {
  checked: boolean;
  onToggle: (next: boolean) => Promise<{ error?: string } | void>;
  labelOn?: string;
  labelOff?: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await onToggle(!checked);
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={isPending}
      onClick={handleClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50",
        checked
          ? "bg-primrose-green/15 text-primrose-green-dark"
          : "bg-primrose-ink/10 text-primrose-ink/60"
      )}
    >
      {checked ? labelOn : labelOff}
    </button>
  );
}
