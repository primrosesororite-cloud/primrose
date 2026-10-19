import { getLocale, getTranslations } from "next-intl/server";
import { AnimateIn } from "@/components/motion/animate-in";
import { SectionHeading } from "@/components/sections/section-heading";
import { MissionsExplorer } from "@/components/sections/missions-explorer";
import { getMissions } from "@/lib/data/contenus";

export async function MissionsSection() {
  const t = await getTranslations("home.missions");
  const missions = await getMissions(await getLocale());

  return (
    <section id="missions" className="scroll-mt-24 bg-primrose-cream px-4 pb-20 pt-16 md:px-6 md:pb-28 md:pt-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t("eyebrow")} title={t("titre")} text={t("texte")} />
        <AnimateIn className="mt-12">
          <MissionsExplorer missions={missions} />
        </AnimateIn>
      </div>
    </section>
  );
}
