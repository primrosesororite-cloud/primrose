import { setRequestLocale, getTranslations } from "next-intl/server";
import { getEvenementsPublies } from "@/lib/data/evenements";
import { evenementJsonLd } from "@/lib/json-ld";
import { AnimateIn } from "@/components/motion/animate-in";
import { staggerContainer } from "@/lib/motion";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "evenements" });
  return buildMetadata({ locale, title: t("titre"), description: t("texte"), path: "/evenements" });
}

export default async function EvenementsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("evenements");
  const evenements = await getEvenementsPublies();

  return (
    <>
    <PageHeader eyebrow={t("eyebrow")} title={t("titre")} intro={t("texte")} />
    <section className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
      {evenements.map((evenement) => (
        <script
          key={evenement.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(evenementJsonLd(evenement)) }}
        />
      ))}

      {evenements.length === 0 ? (
        <p className="rounded-card bg-primrose-cream p-8 text-center text-primrose-ink/80">
          {t("vide")}
        </p>
      ) : (
        <AnimateIn variants={staggerContainer}>
          <ul className="space-y-4">
            {evenements.map((evenement) => (
              <li key={evenement.id}>
                <AnimateIn>
                  <div className="rounded-card border border-primrose-ink/10 border-l-4 border-l-primrose-green bg-primrose-white p-6 shadow-card md:p-7">
                    <p className="text-xs font-medium uppercase tracking-wide text-primrose-forest">
                      {new Date(evenement.date_evenement).toLocaleDateString(locale, {
                        dateStyle: "long",
                      })}
                    </p>
                    <h2 className="mt-2 font-serif text-2xl text-primrose-ink">
                      {evenement.titre}
                    </h2>
                    {evenement.description && (
                      <p className="mt-1 text-sm text-primrose-ink/80">{evenement.description}</p>
                    )}
                    {evenement.lieu && (
                      <p className="mt-2 text-xs text-primrose-ink/75">
                        {t("lieu")} : {evenement.lieu}
                      </p>
                    )}
                  </div>
                </AnimateIn>
              </li>
            ))}
          </ul>
        </AnimateIn>
      )}
    </section>
    </>
  );
}
