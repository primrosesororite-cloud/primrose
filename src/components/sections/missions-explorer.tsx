"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Megaphone, HeartHandshake, Flag, GraduationCap, ArrowRight, Check, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { EASE, SPRING } from "@/lib/motion";
import type { AxeKey, MissionContent } from "@/lib/data/contenus";

const ICONS: Record<AxeKey, LucideIcon> = {
  prevenir: Megaphone,
  soutenir: HeartHandshake,
  plaider: Flag,
  former: GraduationCap,
};

function asVerb(titre: string) {
  return titre.charAt(0) + titre.slice(1).toLowerCase();
}

export function MissionsExplorer({ missions }: { missions: MissionContent[] }) {
  const t = useTranslations("home.missions");
  const [active, setActive] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
  const keys: Record<string, number> = {
  ArrowDown: 1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowLeft: -1,
  };
  let next: number | null = null;
  if (event.key in keys) next = (index + keys[event.key] + missions.length) % missions.length;
  if (event.key === "Home") next = 0;
  if (event.key === "End") next = missions.length - 1;
  if (next === null) return;
  event.preventDefault();
  setActive(next);
  tabsRef.current[next]?.focus();
  }

  const courante = missions[active];
  const { key, actions } = courante;
  const Icon = ICONS[key];

  return (
  <div className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr] lg:gap-14">
  <div role="tablist" aria-orientation="vertical" aria-label={t("titre")} className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-1">
  {missions.map((mission, index) => {
  const selected = index === active;
  return (
  <button
  key={mission.key}
  ref={(el) => {
  tabsRef.current[index] = el;
  }}
  type="button"
  role="tab"
  id={`axe-tab-${mission.key}`}
  aria-selected={selected}
  aria-controls={`axe-panel-${mission.key}`}
  tabIndex={selected ? 0 : -1}
  onClick={() => setActive(index)}
  onKeyDown={(event) => onKeyDown(event, index)}
  className={cn(
"group relative isolate rounded-2xl px-5 py-4 text-left transition-colors lg:py-5 lg:pl-8",
  !selected && "hover:bg-primrose-white/60"
  )}
  >
  {selected && (
  <>
  <motion.span
  layoutId="axe-fond"
  transition={SPRING}
  aria-hidden
  className="absolute inset-0 -z-10 rounded-2xl bg-primrose-white shadow-[0_12px_30px_-22px_rgba(52,80,59,0.6)]"
  />
  <motion.span
  layoutId="axe-indicateur"
  transition={SPRING}
  aria-hidden
  className="absolute inset-y-3 left-0 hidden w-1.5 rounded-full bg-primrose-forest lg:block"
  />
  </>
  )}
  <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-primrose-forest">
  {t(`moments.${mission.key}`)}
  </span>
  <span
  className={cn(
"mt-1 block font-serif text-2xl transition-colors md:text-[2.4rem] md:leading-tight",
  selected ? "text-primrose-ink" : "text-primrose-ink/70 group-hover:text-primrose-ink"
  )}
  >
  {asVerb(mission.titre)}
  </span>
  </button>
  );
  })}
  </div>

  <div className="relative rounded-[1.75rem] bg-primrose-white p-7 shadow-card md:p-10">
  <AnimatePresence mode="wait" initial={false}>
  <motion.div
  key={key}
  role="tabpanel"
  id={`axe-panel-${key}`}
  aria-labelledby={`axe-tab-${key}`}
  initial={{ opacity: 0, y: 14 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.35, ease: EASE }}
  >
  <div className="flex items-start justify-between gap-6">
  <p className="font-serif text-2xl leading-snug text-primrose-ink md:text-[2rem]">
  {courante.description}
  </p>
  <motion.span
                initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ ...SPRING, delay: 0.08 }}
                className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primrose-cream text-primrose-forest sm:flex"
  >
  <Icon aria-hidden className="h-8 w-8" strokeWidth={1.6} />
  </motion.span>
  </div>

  <p className="mt-5 text-base leading-relaxed text-primrose-ink/80">{courante.detail}</p>

  <h3 className="mt-8 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-primrose-forest">
  {t("concretement")}
  </h3>
  <ul className="mt-4 space-y-3">
  {actions.map((action, index) => (
  <motion.li
  key={action}
  initial={{ opacity: 0, x: -10 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.35, delay: 0.12 + index * 0.07, ease: EASE }}
  className="flex items-start gap-3 text-primrose-ink"
  >
  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primrose-green/30 text-primrose-forest">
  <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
  </span>
  {action}
  </motion.li>
  ))}
  </ul>

  <Link
  href={`/notre-mission#${key}`}
  className="group mt-9 inline-flex items-center gap-2 border-b border-primrose-forest/30 pb-1 text-sm font-semibold text-primrose-forest transition-colors hover:border-primrose-forest"
  >
  {t("enSavoirPlus")}
  <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1" />
  </Link>
  </motion.div>
  </AnimatePresence>
  </div>
  </div>
  );
}
