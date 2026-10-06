import { setRequestLocale, getTranslations } from "next-intl/server";
import { getFormations } from "@/lib/data/formations";
import { FormationsList } from "@/components/sections/formations-list";
import { PageHeader } from "@/components/sections/page-header";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "formations" });
  return buildMetadata({
    locale,
    title: t("titre"),
    description: t("texte"),
    path: "/formations",
  });
}

export default async function FormationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("formations");
  const formations = await getFormations();

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("titre")} intro={t("texte")} />
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <FormationsList formations={formations} />
      </section>
    </>
  );
}
