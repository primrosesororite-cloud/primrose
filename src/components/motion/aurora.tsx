import { cn } from "@/lib/utils";

/**
 * Halos de couleur qui dérivent lentement en arrière-plan. Dégradés radiaux
 * (pas de filtre flou, coûteux sur mobile) animés uniquement en transform ;
 * figés sous prefers-reduced-motion (voir .aurora-blob dans globals.css).
 */
export function Aurora({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <span
        className={cn(
          "aurora-blob -left-[15%] top-[30%] h-[38rem] w-[38rem]",
          dark ? "aurora-green-strong" : "aurora-green"
        )}
      />
      <span
        className={cn(
          "aurora-blob aurora-delay-1 -right-[10%] top-[5%] h-[34rem] w-[34rem]",
          dark ? "aurora-cream-soft" : "aurora-white"
        )}
      />
      <span
        className={cn(
          "aurora-blob aurora-delay-2 left-[35%] -bottom-[25%] h-[30rem] w-[30rem]",
          dark ? "aurora-green-strong" : "aurora-forest"
        )}
      />
    </div>
  );
}
