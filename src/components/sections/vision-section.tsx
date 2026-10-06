import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AnimateIn } from "@/components/motion/animate-in";
import { stagger } from "@/lib/motion";
import { SectionHeading } from "@/components/sections/section-heading";

export function VisionSection() {
  const t = useTranslations("home.vision");
  const valeurs = t.raw("valeurs") as string[];

  return (
  <section className="bg-primrose-forest px-4 py-20 md:px-6 md:py-28">
  <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
  <AnimateIn>
  <SectionHeading eyebrow={t("eyebrow")} title={t("titre")} text={t("texte")} tone="dark" />
  <Link
  href="/a-propos"
  className="group mt-8 inline-flex items-center gap-2 border-b border-primrose-white/40 pb-1 text-sm font-semibold text-primrose-white transition-colors hover:border-primrose-white"
  >
  {t("lien")}
  <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300" />
  </Link>
  </AnimateIn>

  <AnimateIn delay={0.1}>
  <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primrose-white/80">
  {t("valeursTitre")}
  </h3>
  <AnimateIn variants={stagger}>
  <ul className="mt-4 divide-y divide-primrose-white/15 border-y border-primrose-white/15">
  {valeurs.map((valeur) => (
  <li key={valeur}>
  <AnimateIn className="group flex items-center gap-4 py-4">
  <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-primrose-green transition-transform duration-300" />
  <span className="font-serif text-2xl italic text-primrose-white transition-transform duration-300 md:text-[1.75rem]">{valeur}</span>
  </AnimateIn>
  </li>
  ))}
  </ul>
  </AnimateIn>
  </AnimateIn>
  </div>
  </section>
  );
}
