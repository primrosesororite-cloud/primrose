import { useTranslations } from "next-intl";
import { VelocityMarquee } from "@/components/motion/velocity-marquee";

const AXES = ["prevenir", "soutenir", "plaider", "former"] as const;

/** Les quatre axes en très grand, alternant plein et contour, qui défilent avec la page. */
export function AxesMarquee() {
  const t = useTranslations("nav");
  const libelles = AXES.map((axe) => t(axe));

  return (
    <section aria-label={libelles.join(", ")} className="overflow-hidden bg-primrose-cream py-10 md:py-16">
      <VelocityMarquee>
        {libelles.map((libelle, index) => (
          <span key={libelle} className="flex items-center">
            <span
              className={
                index % 2 === 0
                  ? "font-serif text-[18vw] italic leading-none text-primrose-forest md:text-[9rem]"
                  : "text-outline-forest font-serif text-[18vw] italic leading-none md:text-[9rem]"
              }
            >
              {libelle}
            </span>
            <span aria-hidden className="mx-6 h-4 w-4 shrink-0 rounded-full bg-primrose-green md:mx-12 md:h-6 md:w-6" />
          </span>
        ))}
      </VelocityMarquee>
    </section>
  );
}
