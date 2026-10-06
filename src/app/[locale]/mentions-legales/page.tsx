import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mentionsLegales" });
  return buildMetadata({ locale, title: t("titre"), description: t("titre"), path: "/mentions-legales" });
}

const SECTIONS = ["editeur", "directeur", "hebergement", "contact"] as const;

export default async function MentionsLegalesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("mentionsLegales");

  return (
    <>
    <PageHeader eyebrow={t("eyebrow")} title={t("titre")} />
    <section className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
      <p className="mt-4 rounded-xl bg-primrose-cream p-4 text-sm text-primrose-ink">
        {t("avertissement")}
      </p>

      <div className="mt-10 space-y-10">
        {SECTIONS.map((key) => (
          <div key={key}>
            <h2 className="font-serif text-2xl text-primrose-forest">
              {t(`${key}.titre`)}
            </h2>
            <p className="mt-3 leading-relaxed text-primrose-ink/85">{t(`${key}.texte`)}</p>
          </div>
        ))}
      </div>
    </section>
    </>
  );
}
