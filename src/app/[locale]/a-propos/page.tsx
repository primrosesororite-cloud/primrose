import { setRequestLocale, getTranslations } from "next-intl/server";
import { getEquipe, getPartenaires } from "@/lib/data/team";
import { TeamSection } from "@/components/sections/team-section";
import { PartnersCarousel } from "@/components/sections/partners-carousel";
import { AnimateIn } from "@/components/motion/animate-in";
import { StaggerItem } from "@/components/motion/stagger-item";
import { stagger } from "@/lib/motion";
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
  const valeurs = t.raw("valeurs") as { titre: string; accroche: string; texte: string }[];

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
          </AnimateIn>
          <AnimateIn variants={stagger} className="mt-12">
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {valeurs.map((valeur) => (
                <li key={valeur.titre}>
                  <StaggerItem className="h-full">
                    <article className="h-full rounded-card bg-primrose-white p-6 shadow-card">
                      <h3 className="font-serif text-2xl italic text-primrose-forest">{valeur.titre}</h3>
                      <p className="mt-3 text-sm font-semibold text-primrose-ink">{valeur.accroche}</p>
                      <p className="mt-3 text-sm leading-relaxed text-primrose-ink/80">{valeur.texte}</p>
                    </article>
                  </StaggerItem>
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
