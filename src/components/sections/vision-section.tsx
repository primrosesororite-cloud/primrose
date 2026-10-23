import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AnimateIn } from "@/components/motion/animate-in";
import { StaggerItem } from "@/components/motion/stagger-item";
import { stagger } from "@/lib/motion";
import { SectionHeading } from "@/components/sections/section-heading";
import { getVision } from "@/lib/data/contenus";

export async function VisionSection() {
  const t = await getTranslations("home.vision");
  const { titre, texte, valeurs } = await getVision(await getLocale());

  return (
  <section className="bg-primrose-forest px-4 py-20 md:px-6 md:py-28">
  <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
  <AnimateIn>
  <SectionHeading eyebrow={t("eyebrow")} title={titre} text={texte} tone="dark" highlight />
  <Link
  href="/a-propos"
  className="group mt-8 inline-flex items-center gap-2 border-b border-primrose-white/40 pb-1 text-sm font-semibold text-primrose-white transition-colors hover:border-primrose-white"
  >
  {t("lien")}
  <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1" />
  </Link>
  </AnimateIn>

  {valeurs.length > 0 && (
  <AnimateIn delay={0.1}>
  <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primrose-white/80">
  {t("valeursTitre")}
  </h3>
  <AnimateIn variants={stagger}>
  <ul className="glass-surface-dark mt-4 divide-y divide-primrose-white/15 rounded-3xl px-5">
  {valeurs.map((valeur) => (
  <li key={valeur}>
  <StaggerItem className="group flex items-center gap-4 py-4">
  <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-primrose-green transition-transform duration-300 motion-safe:group-hover:scale-150" />
  <span className="font-serif text-2xl italic text-primrose-white transition-transform duration-300 motion-safe:group-hover:translate-x-2 md:text-[1.75rem]">{valeur}</span>
  </StaggerItem>
  </li>
  ))}
  </ul>
  </AnimateIn>
  </AnimateIn>
  )}
  </div>
  </section>
  );
}
