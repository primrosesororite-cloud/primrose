"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { AnimateIn } from "@/components/motion/animate-in";
import type { MissionContent } from "@/lib/data/contenus";

export function MissionDetailSection({
  mission,
  icon,
  reverse = false,
}: {
  mission: MissionContent;
  icon: React.ReactNode;
  reverse?: boolean;
}) {
  const t = useTranslations("missions");
  const { key: missionKey, valeurs, actions } = mission;

  return (
    <section
      id={missionKey}
      className="mx-auto grid max-w-6xl scroll-mt-28 items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-16 md:px-6 md:py-24"
    >
      <div className={cn("flex justify-center", reverse && "md:order-2")}>
        <div className="flex h-56 w-56 items-center justify-center rounded-full bg-primrose-cream ring-1 ring-primrose-green/30 md:h-64 md:w-64"
        >
          {icon}
        </div>
      </div>

      <AnimateIn className={cn(reverse && "md:order-1")}>
        <h2 className="font-sans text-sm font-bold tracking-[0.16em] text-primrose-forest">
          {mission.titre}
        </h2>
        <p className="mt-4 font-serif text-2xl leading-snug text-primrose-ink md:text-[1.9rem]">{mission.description}</p>
        <p className="mt-4 text-base leading-relaxed text-primrose-ink/80 md:text-lg">{mission.detail}</p>

        <h3 className="mt-8 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-primrose-forest">
          {t("concretement")}
        </h3>
        <ul className="mt-4 space-y-3">
          {actions.map((action) => (
            <li key={action} className="flex items-start gap-3 text-primrose-ink">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primrose-green/30 text-primrose-forest">
                <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
              </span>
              {action}
            </li>
          ))}
        </ul>

        {valeurs?.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {valeurs.map((valeur) => (
              <li
                key={valeur}
                className="rounded-full border border-primrose-green/40 px-3.5 py-1.5 text-xs font-semibold text-primrose-ink"
              >
                {valeur}
              </li>
            ))}
          </ul>
        )}
      </AnimateIn>
    </section>
  );
}
