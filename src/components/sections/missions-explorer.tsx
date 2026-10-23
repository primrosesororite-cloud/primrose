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

  if (missions.length === 0) return null;

  const courante = missions[active] ?? missions[0];
  const { key, actions } = courante;
  const Icon = ICONS[key];

  return (
    <div className="relative isolate grid items-stretch gap-4 overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,rgba(245,251,244,0.82),rgba(218,235,218,0.68)_52%,rgba(199,222,201,0.58))] p-3 shadow-[0_28px_80px_-48px_rgba(35,69,45,0.5)] backdrop-blur-2xl sm:gap-5 sm:rounded-[2.5rem] sm:p-5 lg:grid-cols-[minmax(15rem,0.72fr)_minmax(0,1.28fr)] lg:gap-6 lg:p-6">
      <div aria-hidden className="pointer-events-none absolute -left-20 -top-24 -z-10 h-72 w-72 rounded-full bg-white/70 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 right-[20%] -z-10 h-80 w-80 rounded-full bg-primrose-green/20 blur-3xl" />
      <div className="relative rounded-[1.75rem] border border-white/60 bg-white/25 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl sm:p-3 lg:flex lg:flex-col lg:justify-center lg:gap-2">
        <div role="tablist" aria-orientation="vertical" aria-label={t("titre")} className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-2.5">
          {missions.map((mission, index) => {
            const selected = index === active;
            const MissionIcon = ICONS[mission.key];
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
                  "group relative isolate flex min-h-[6.5rem] items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 text-left transition-[color,transform,background-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primrose-forest focus-visible:ring-offset-2 focus-visible:ring-offset-primrose-cream sm:min-h-[7.25rem] sm:gap-4 sm:px-5 lg:min-h-[6rem] lg:rounded-[1.4rem]",
                  selected
                    ? "text-white shadow-[0_18px_35px_-24px_rgba(35,69,45,0.9)]"
                    : "text-primrose-ink/75 hover:bg-white/55 hover:text-primrose-ink"
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="axe-fond"
                    transition={SPRING}
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-2xl border border-white/20 bg-[linear-gradient(135deg,rgba(73,112,78,0.94),rgba(47,82,55,0.88))] shadow-[inset_0_1px_0_rgba(255,255,255,0.24)] backdrop-blur-xl lg:rounded-[1.4rem]"
                  />
                )}
                <span className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors duration-300 sm:h-11 sm:w-11",
                  selected ? "bg-white/15 text-white" : "bg-white/65 text-primrose-forest group-hover:bg-white"
                )}>
                  <MissionIcon aria-hidden className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <span className="min-w-0">
                  <span className={cn(
                    "block text-[0.58rem] font-semibold uppercase leading-tight tracking-[0.12em] sm:text-[0.65rem] sm:tracking-[0.15em]",
                    selected ? "text-white/75" : "text-primrose-forest/80"
                  )}>
                    {t(`moments.${mission.key}`)}
                  </span>
                  <span className="mt-1 block font-serif text-xl leading-tight sm:text-2xl lg:text-[1.8rem]">
                    {asVerb(mission.titre)}
                  </span>
                </span>
                {selected && <span aria-hidden className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-white/80 sm:right-4 sm:top-4" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative min-h-[25rem] overflow-hidden rounded-[1.75rem] border border-white/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.88),rgba(239,248,237,0.76)_55%,rgba(220,237,219,0.7))] p-6 shadow-[0_24px_70px_-42px_rgba(39,67,45,0.48),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl sm:p-8 md:min-h-[29rem] md:rounded-[2rem] md:p-10">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primrose-green/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/3 h-36 w-2/3 rounded-full bg-white/40 blur-3xl" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={key}
            role="tabpanel"
            id={`axe-panel-${key}`}
            aria-labelledby={`axe-tab-${key}`}
            tabIndex={0}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="relative flex h-full flex-col focus-visible:outline-none"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primrose-forest">
                <span className="h-1.5 w-1.5 rounded-full bg-primrose-green" />
                {t(`moments.${key}`)}
              </p>
              <span className="font-sans text-xs font-medium tabular-nums text-primrose-ink/45">
                {String(active + 1).padStart(2, "0")} <span className="mx-1 text-primrose-green/70">/</span> {String(missions.length).padStart(2, "0")}
              </span>
            </div>

            <div className="mt-5 flex items-start justify-between gap-5 sm:mt-6">
              <h3 className="max-w-[39rem] font-serif text-[1.65rem] leading-[1.18] tracking-[-0.02em] text-primrose-ink sm:text-[2rem] md:text-[2.35rem]">
                {courante.description}
              </h3>
              <motion.span
                initial={{ opacity: 0, scale: 0.75, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ ...SPRING, delay: 0.06 }}
                className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primrose-forest/5 bg-primrose-cream text-primrose-forest sm:flex md:h-16 md:w-16"
              >
                <Icon aria-hidden className="h-7 w-7 md:h-8 md:w-8" strokeWidth={1.6} />
              </motion.span>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-primrose-ink/75 sm:mt-5 sm:text-base sm:leading-7">
              {courante.detail}
            </p>

            <div className="mt-6 border-t border-primrose-forest/10 pt-5 sm:mt-7 sm:pt-6">
              <h4 className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-primrose-forest">
                {t("concretement")}
              </h4>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 sm:gap-2.5">
                {actions.map((action, index) => (
                  <motion.li
                    key={action}
                    initial={{ opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: 0.08 + index * 0.05, ease: EASE }}
                    className="flex min-h-11 items-start gap-2.5 rounded-xl bg-primrose-cream/55 px-3 py-2.5 text-sm leading-5 text-primrose-ink sm:col-span-1"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primrose-green/25 text-primrose-forest">
                      <Check aria-hidden className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    {action}
                  </motion.li>
                ))}
              </ul>
            </div>

            <Link
              href={`/notre-mission#${key}`}
              className="group mt-auto inline-flex w-fit items-center gap-2 border-b border-primrose-forest/25 pb-1 pt-6 text-sm font-semibold text-primrose-forest transition-colors hover:border-primrose-forest focus-visible:rounded-sm"
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
