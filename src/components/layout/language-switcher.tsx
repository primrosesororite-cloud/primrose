"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Bascule FR / EN qui garde la page en cours (/a-propos ↔ /en/a-propos).
 * De vrais liens (pas de JavaScript requis), avec la langue cible annoncée
 * aux lecteurs d'écran et aux moteurs (lang / hrefLang).
 */
export function LanguageSwitcher({ id, className }: { id: string; className?: string }) {
  const t = useTranslations("nav.langue");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("choisir")} className={cn("isolate", className)}>
      <ul className="flex items-center rounded-full border border-primrose-forest/20 bg-primrose-white/70 p-0.5">
        {routing.locales.map((cible: Locale) => {
          const actif = cible === locale;
          return (
            <li key={cible}>
              <Link
                href={pathname}
                locale={cible}
                lang={cible}
                hrefLang={cible}
                aria-label={t(cible)}
                aria-current={actif ? "true" : undefined}
                className={cn(
                  "relative isolate block rounded-full px-2.5 py-1 text-[0.72rem] font-bold uppercase tracking-[0.08em] transition-colors",
                  actif ? "text-primrose-white" : "text-primrose-forest hover:bg-primrose-cream"
                )}
              >
                {actif && (
                  <motion.span
                    layoutId={`${id}-langue`}
                    transition={SPRING}
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-full bg-primrose-forest"
                  />
                )}
                {cible}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
