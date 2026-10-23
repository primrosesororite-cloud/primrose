"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AnimateIn } from "@/components/motion/animate-in";
import { StaggerItem } from "@/components/motion/stagger-item";
import { stagger } from "@/lib/motion";
import type { Database, FormationStatut } from "@/types/database";

type Formation = Database["public"]["Tables"]["formations"]["Row"];

const STATUTS: FormationStatut[] = ["ouverte", "complete", "terminee"];

type FilterOption = { value: string; label: string };

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const reduceMotion = useReducedMotion();
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setHighlighted(selectedIndex);
        setOpen(true);
      } else {
        setHighlighted((current) => (current + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
      }
    } else if ((event.key === "Enter" || event.key === " ") && !open) {
      event.preventDefault();
      setHighlighted(selectedIndex);
      setOpen(true);
    } else if ((event.key === "Enter" || event.key === " ") && open) {
      event.preventDefault();
      onChange(options[highlighted]?.value ?? value);
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  const selected = options[selectedIndex];

  return (
    <div ref={rootRef} className="relative w-full sm:w-auto">
      <button
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={`${id}-options`}
        aria-haspopup="listbox"
        aria-activedescendant={open ? `${id}-option-${highlighted}` : undefined}
        onClick={() => {
          setHighlighted(selectedIndex);
          setOpen((current) => !current);
        }}
        onKeyDown={onKeyDown}
        className="glass-surface group flex min-h-12 w-full items-center justify-between gap-5 rounded-full px-4 py-2.5 text-left text-sm font-medium text-primrose-ink transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-20px_rgba(52,80,59,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primrose-forest focus-visible:ring-offset-2 sm:min-w-[12rem]"
      >
        <span className="truncate">{selected?.label ?? label}</span>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primrose-forest/10 text-primrose-forest transition-colors group-hover:bg-primrose-forest/20">
          <ChevronDown aria-hidden className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={`${id}-options`}
            role="listbox"
            aria-label={label}
            initial={reduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="glass-surface absolute left-0 top-[calc(100%+0.55rem)] z-50 max-h-64 w-full min-w-[14rem] overflow-y-auto rounded-2xl p-1.5 shadow-[0_24px_55px_-25px_rgba(30,60,39,0.48)]"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlighted;
              return (
                <div
                  key={option.value}
                  id={`${id}-option-${index}`}
                  role="option"
                  tabIndex={-1}
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex min-h-10 w-full cursor-pointer select-none items-center justify-between gap-3 rounded-xl px-3.5 py-2 text-left text-sm transition-colors ${isSelected ? "bg-primrose-forest text-white" : isHighlighted ? "bg-white/80 text-primrose-ink" : "text-primrose-ink/80 hover:bg-white/70 hover:text-primrose-ink"}`}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check aria-hidden className="h-4 w-4 shrink-0" strokeWidth={2.5} />}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
  <FilterSelect
  label={t("filtrerStatut")}
  value={statutFilter}
  onChange={(value) => setStatutFilter(value as FormationStatut | "tous")}
  options={[
    { value: "tous", label: t("filtrerStatut") },
    ...STATUTS.map((statut) => ({ value: statut, label: t(`statut.${statut}`) })),
  ]}
  />

  {publics.length > 0 && (
  <FilterSelect
  label={t("filtrerPublic")}
  value={publicFilter}
  onChange={setPublicFilter}
  options={[
    { value: "tous", label: t("filtrerPublic") },
    ...publics.map((publicCible) => ({ value: publicCible, label: publicCible })),
  ]}
  />
  )}
  </div>

  {filtered.length === 0 ? (
  <p className="mt-8 rounded-card bg-primrose-cream p-6 text-primrose-ink/80">
  {t("vide")}
  </p>
  ) : (
  <AnimateIn variants={stagger} className="mt-8">
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {filtered.map((formation) => (
  <StaggerItem key={formation.id}>
  <Link
  href={`/formations/${formation.slug}`}
  className="glass-surface group flex h-full flex-col gap-3 rounded-card p-7 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_28px_50px_-24px_rgba(52,80,59,0.45)]"
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
  </StaggerItem>
  ))}
  </div>
  </AnimateIn>
  )}
  </div>
  );
}
