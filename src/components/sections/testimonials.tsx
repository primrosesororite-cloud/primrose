import { useTranslations } from "next-intl";
import { AnimateIn } from "@/components/motion/animate-in";
import { SectionHeading } from "@/components/sections/section-heading";

/**
 * Aucun témoignage n'est inventé ici : publier de fausses citations attribuées
 * à des membres ou des survivantes serait trompeur et potentiellement nuisible.
 * Cette section affiche un état d'attente tant que l'association n'a pas
 * fourni de témoignages réels et le consentement de les publier.
 */
export function Testimonials() {
  const t = useTranslations("rejoindre.temoignages");

  return (
    <section className="bg-primrose-cream px-4 py-16 text-center md:px-6 md:py-20">
      <AnimateIn>
        <SectionHeading title={t("titre")} text={t("aVenir")} align="center" />
      </AnimateIn>
    </section>
  );
}
