import { setRequestLocale, getTranslations } from "next-intl/server";
import { RejoindreFlow } from "@/components/forms/rejoindre-flow";
import { Testimonials } from "@/components/sections/testimonials";
import { FaqSection } from "@/components/sections/faq-section";
import { PageHeader } from "@/components/sections/page-header";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rejoindre" });
  return buildMetadata({
    locale,
    title: t("titre"),
    description: t("texte"),
    path: "/rejoindre",
  });
}

export default async function RejoindrePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rejoindre");

  return (
    <div>
      <PageHeader eyebrow={t("eyebrow")} title={t("titre")} intro={t("texte")} />
      <div className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <RejoindreFlow />
      </div>

      <Testimonials />
      <FaqSection />
    </div>
  );
}
