import { AnimateIn } from "@/components/motion/animate-in";
import { ConvergingBands } from "@/components/sections/converging-bands";
import { RevealText } from "@/components/motion/reveal-text";

/**
 * En-tête des pages intérieures. Le chevron et les deux bandes qui
 * convergent vers sa pointe reprennent le héro de l'accueil : des forces qui
 * se rejoignent pour soutenir une même personne, comme les mains du logo.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-primrose-forest [clip-path:polygon(0_0,100%_0,100%_calc(100%_-_2.5rem),50%_100%,0_calc(100%_-_2.5rem))] md:[clip-path:polygon(0_0,100%_0,100%_calc(100%_-_4rem),50%_100%,0_calc(100%_-_4rem))]">
      <ConvergingBands />

      <div className="relative mx-auto max-w-3xl px-4 pb-24 pt-14 text-center md:px-6 md:pb-32 md:pt-20">
        {eyebrow && (
          <AnimateIn>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primrose-white/80">
              {eyebrow}
            </p>
          </AnimateIn>
        )}
        <AnimateIn>
          <h1 className="mt-3 font-serif text-4xl leading-[1.08] text-primrose-white md:text-[3.4rem]"><RevealText text={title} /></h1>
        </AnimateIn>
        {intro && (
          <AnimateIn delay={0.35}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-primrose-white/85 md:text-lg">
              {intro}
            </p>
          </AnimateIn>
        )}
      </div>
    </section>
  );
}
