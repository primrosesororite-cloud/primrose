import { getTranslations } from "next-intl/server";
import { AnimateIn } from "@/components/motion/animate-in";
import { StaggerItem } from "@/components/motion/stagger-item";
import { CountUp } from "@/components/motion/count-up";
import { SectionHeading } from "@/components/sections/section-heading";
import { stagger } from "@/lib/motion";
import { getChiffresCles } from "@/lib/data/contenus";

/** Chiffres clés de l'association (admin → Contenus du site). Masquée tant qu'aucun chiffre n'est renseigné. */
export async function StatsSection() {
  const chiffres = await getChiffresCles();
  if (chiffres.length === 0) return null;

  const t = await getTranslations("home.chiffres");

  return (
    <section className="bg-primrose-cream px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t("eyebrow")} title={t("titre")} />

        <AnimateIn variants={stagger} className="mt-12">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {chiffres.map((chiffre) => (
              <StaggerItem key={chiffre.id} className="border-t-2 border-primrose-forest/30 pt-5">
                <dd className="font-serif text-[2.75rem] leading-none text-primrose-forest md:text-[4rem]">
                  <CountUp valeur={chiffre.valeur} suffixe={chiffre.suffixe} />
                </dd>
                <dt className="mt-3 text-sm font-medium text-primrose-ink/80 md:text-base">{chiffre.libelle}</dt>
              </StaggerItem>
            ))}
          </dl>
        </AnimateIn>
      </div>
    </section>
  );
}
