"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AnimateIn } from "@/components/motion/animate-in";
import { staggerContainer } from "@/lib/motion";
import type { Database, FormationStatut } from "@/types/database";

type Formation = Database["public"]["Tables"]["formations"]["Row"];

const STATUTS: FormationStatut[] = ["ouverte", "complete", "terminee"];

export function FormationsList({ formations }: { formations: Formation[] }) {
  const t = useTranslations("formations");
  const [statutFilter, setStatutFilter] = useState<FormationStatut | "tous">("tous");
  const [publicFilter, setPublicFilter] = useState<string>("tous");

  const publics = useMemo(() => {
    const set = new Set(formations.map((f) => f.public_cible).filter(Boolean) as string[]);
    return Array.from(set);
  }, [formations]);

  const filtered = formations.filter((f) => {
    if (statutFilter !== "tous" && f.statut !== statutFilter) return false;
    if (publicFilter !== "tous" && f.public_cible !== publicFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <select
          value={statutFilter}
          onChange={(e) => setStatutFilter(e.target.value as FormationStatut | "tous")}
          className="rounded-full border border-primrose-ink/20 bg-primrose-white px-4 py-2.5 text-sm text-primrose-ink"
          aria-label={t("filtrerStatut")}
        >
          <option value="tous">{t("filtrerStatut")}</option>
          {STATUTS.map((statut) => (
            <option key={statut} value={statut}>
              {t(`statut.${statut}`)}
            </option>
          ))}
        </select>

        {publics.length > 0 && (
          <select
            value={publicFilter}
            onChange={(e) => setPublicFilter(e.target.value)}
            className="rounded-full border border-primrose-ink/20 bg-primrose-white px-4 py-2.5 text-sm text-primrose-ink"
            aria-label={t("filtrerPublic")}
          >
            <option value="tous">{t("filtrerPublic")}</option>
            {publics.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-card bg-primrose-cream p-6 text-primrose-ink/80">
          {t("vide")}
        </p>
      ) : (
        <AnimateIn variants={staggerContainer} className="mt-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((formation) => (
              <AnimateIn key={formation.id}>
                <Link
                  href={`/formations/${formation.slug}`}
                  className="group flex h-full flex-col gap-3 rounded-card border border-primrose-ink/10 bg-primrose-white p-7 shadow-card transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_28px_50px_-24px_rgba(52,80,59,0.45)]"
                >
                  <span className="w-fit rounded-full bg-primrose-green/15 px-3 py-1 text-xs font-medium text-primrose-forest">
                    {t(`statut.${formation.statut}`)}
                  </span>
                  <h2 className="font-serif text-xl leading-snug text-primrose-ink">
                    {formation.titre}
                  </h2>
                  {formation.description && (
                    <p className="text-sm text-primrose-ink/80">{formation.description}</p>
                  )}
                  {formation.public_cible && (
                    <p className="mt-auto pt-2 text-xs font-semibold uppercase tracking-[0.12em] text-primrose-forest">{formation.public_cible}</p>
                  )}
                </Link>
              </AnimateIn>
            ))}
          </div>
        </AnimateIn>
      )}
    </div>
  );
}
