import { setRequestLocale, getTranslations } from "next-intl/server";
import { getEquipe, getPartenaires } from "@/lib/data/team";
import { TeamSection } from "@/components/sections/team-section";
import { PartnersCarousel } from "@/components/sections/partners-carousel";
import { AnimateIn } from "@/components/motion/animate-in";
import { PageHeader } from "@/components/sections/page-header";
import { SectionHeading } from "@/components/sections/section-heading";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aPropos" });
  return buildMetadata({
    locale,
    title: t("titre"),
    description: t("histoireTexte"),
    path: "/a-propos",
  });
}

export default async function AProposPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aPropos");
  const [equipe, partenaires] = await Promise.all([getEquipe(), getPartenaires()]);
  const valeurs = t.raw("valeurs") as string[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("titre")} intro={t("intro")} />

      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_1.5fr] md:gap-16">
          <AnimateIn>
            <SectionHeading title={t("histoireTitre")} />
          </AnimateIn>
          <AnimateIn delay={0.08}>
            <p className="text-lg leading-relaxed text-primrose-ink/85 md:text-xl md:leading-relaxed">
              {t("histoireTexte")}
            </p>
          </AnimateIn>
        </div>
      </section>

      <section className="bg-primrose-cream px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <AnimateIn>
            <SectionHeading title={t("valeursTitre")} align="center" />
            <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
              {valeurs.map((valeur) => (
                <li
                  key={valeur}
                  className="rounded-full border border-primrose-green/40 bg-primrose-white px-6 py-3 font-serif text-xl italic text-primrose-ink"
                >
                  {valeur}
                </li>
              ))}
            </ul>
          </AnimateIn>
        </div>
      </section>

      <TeamSection membres={equipe} />
      <PartnersCarousel partenaires={partenaires} />
    </>
  );
}
