import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AnimateIn } from "@/components/motion/animate-in";
import { scaleIn } from "@/lib/motion";
import { HeroBands } from "@/components/sections/hero-bands";
import { RevealText } from "@/components/motion/reveal-text";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative isolate overflow-hidden bg-primrose-cream">
      <HeroBands />

      <div className="relative mx-auto max-w-5xl px-4 pb-24 pt-10 text-center sm:pt-12 md:px-6 md:pb-28">
        <AnimateIn variants={scaleIn}>
          <div className="relative mx-auto h-44 w-44 rounded-full border-[6px] border-primrose-white bg-primrose-white shadow-[0_24px_60px_-20px_rgba(52,80,59,0.45)] ring-1 ring-primrose-green/40 sm:h-64 sm:w-64">
            <Image
              src="/primrose-logo.png"
              alt="Logo de Primrose – La Sororité Active : des mains entourent et soutiennent une femme"
              fill
              priority
              sizes="(max-width: 640px) 176px, 256px"
              className="rounded-full object-cover [clip-path:circle(48%_at_50%_50%)]"
            />
          </div>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <p className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-primrose-green/40 bg-primrose-white/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primrose-ink sm:text-xs">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primrose-green" />
            {t("eyebrow")}
          </p>
        </AnimateIn>

        <h1 className="mx-auto mt-6 max-w-4xl font-serif text-[2.3rem] leading-[1.05] text-primrose-ink sm:text-5xl md:text-[4rem]">
          <RevealText text={t("titre1")} immediate delay={0.2} />{" "}
          <em className="block font-normal italic text-primrose-forest">
            <RevealText text={t("titre2")} immediate delay={0.5} />
          </em>
        </h1>

        <AnimateIn delay={0.7}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-primrose-ink/80 md:text-lg">
            {t("texte")}
          </p>
        </AnimateIn>

        <AnimateIn delay={0.8}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/notre-mission"
              className="group inline-flex items-center gap-2 rounded-full bg-primrose-forest px-6 py-3 text-sm font-semibold text-primrose-white shadow-[0_10px_24px_-10px_rgba(52,80,59,0.6)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              {t("cta")}
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/rejoindre"
              className="inline-flex items-center rounded-full border border-primrose-forest/30 bg-primrose-white/70 px-6 py-3 text-sm font-semibold text-primrose-forest transition-colors hover:bg-primrose-white"
            >
              {t("ctaRejoindre")}
            </Link>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
