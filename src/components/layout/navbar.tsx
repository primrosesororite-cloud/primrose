"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Lock } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", key: "accueil" },
  { href: "/a-propos", key: "aPropos" },
  { href: "/notre-mission", key: "notreMission" },
  { href: "/formations", key: "formations" },
  { href: "/actualites", key: "actualites" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
  function onScroll() {
  setScrolled(window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
  <motion.header
  initial={shouldReduceMotion ? false : { y: -24, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  className={cn(
"sticky top-0 z-40 border-b border-primrose-green/25 bg-primrose-cream transition-shadow duration-300",
  scrolled && "shadow-[0_8px_24px_-16px_rgba(52,80,59,0.35)]"
  )}
  >
  <nav
  aria-label="Navigation principale"
  className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-6 px-4 md:px-6"
  >
  {/* Le bandeau du header se prolonge en socle arrondi sous le sceau. */}
  <Link href="/" aria-label={t("accueilLogo")} className="relative flex shrink-0 items-center self-start pt-2.5">
  <span
  aria-hidden
  className="absolute left-1/2 top-3 h-[4.25rem] w-[4.25rem] -translate-x-1/2 rounded-b-full border-b border-primrose-green/25 bg-primrose-cream"
  />
  <span className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-primrose-white bg-primrose-white shadow-[0_6px_16px_-6px_rgba(52,80,59,0.5)] ring-1 ring-primrose-green/40">
  <Image
  src="/primrose-logo.png"
  alt=""
  fill
  sizes="56px"
  className="object-cover [clip-path:circle(48%_at_50%_50%)]"
  />
  </span>
  </Link>

  <ul className="hidden items-center gap-1 lg:flex xl:gap-2">
  {NAV_ITEMS.map((item) => {
  const active = isActive(pathname, item.href);
  return (
  <li key={item.href}>
  <Link
  href={item.href}
  aria-current={active ? "page" : undefined}
  className={cn(
"rounded-full px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] transition-colors",
  active
  ? "bg-primrose-green text-primrose-ink"
  : "text-primrose-ink hover:bg-primrose-white"
  )}
  >
  {t(item.key)}
  </Link>
  </li>
  );
  })}
  </ul>

  <div className="hidden items-center gap-2 lg:flex">
  <Link
  href="/rejoindre"
  aria-current={isActive(pathname, "/rejoindre") ? "page" : undefined}
  className={cn(
"rounded-full border px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] transition-colors",
  isActive(pathname, "/rejoindre")
  ? "border-primrose-green bg-primrose-green text-primrose-ink"
  : "border-primrose-forest/25 text-primrose-forest hover:bg-primrose-white"
  )}
  >
  {t("rejoignez")}
  </Link>
  <Link
  href="/besoin-d-aide"
  className="inline-flex items-center gap-1.5 rounded-full bg-primrose-alert px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-primrose-white transition-colors hover:bg-primrose-alert/90"
  >
  <Lock aria-hidden className="h-3.5 w-3.5" />
  {t("besoinDAide")}
  </Link>
  </div>

  <div className="flex items-center gap-2 lg:hidden">
  <Link
  href="/besoin-d-aide"
  className="inline-flex items-center gap-1.5 rounded-full bg-primrose-alert px-3.5 py-2 text-xs font-semibold text-primrose-white"
  >
  <Lock aria-hidden className="h-3.5 w-3.5" />
  <span className="sr-only sm:not-sr-only">{t("besoinDAide")}</span>
  </Link>
  <button
  type="button"
  className="flex h-11 w-11 items-center justify-center rounded-full text-primrose-forest hover:bg-primrose-white"
  aria-label={open ? t("fermerMenu") : t("ouvrirMenu")}
  aria-expanded={open}
  aria-controls="menu-mobile"
  onClick={() => setOpen((v) => !v)}
  >
  {open ? <X aria-hidden /> : <Menu aria-hidden />}
  </button>
  </div>
  </nav>

  <AnimatePresence initial={false}>
  {open && (
  <motion.div
  id="menu-mobile"
  initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  className="overflow-hidden border-t border-primrose-green/25 bg-primrose-cream lg:hidden"
  >
  <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
  {[...NAV_ITEMS, { href: "/rejoindre", key: "rejoignez" } as const].map((item) => {
  const active = isActive(pathname, item.href);
  return (
  <li key={item.href}>
  <Link
  href={item.href}
  aria-current={active ? "page" : undefined}
  onClick={() => setOpen(false)}
  className={cn(
"block rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em]",
  active ? "bg-primrose-green text-primrose-ink" : "text-primrose-ink hover:bg-primrose-white"
  )}
  >
  {t(item.key)}
  </Link>
  </li>
  );
  })}
  </ul>
  </motion.div>
  )}
  </AnimatePresence>
  </motion.header>
  );
}
