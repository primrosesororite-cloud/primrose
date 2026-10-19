import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/hero";
import { HelpStrip } from "@/components/sections/help-strip";
import { MissionsSection } from "@/components/sections/missions-section";
import { VisionSection } from "@/components/sections/vision-section";
import { EngageSection } from "@/components/sections/engage-section";
import { LatestNews } from "@/components/sections/latest-news";
import { getActualitesPage } from "@/lib/data/actualites";
import { StatsSection } from "@/components/sections/stats-section";
import { AxesMarquee } from "@/components/sections/axes-marquee";
import { LatestDocuments } from "@/components/sections/latest-documents";
import { getDocumentsPublies } from "@/lib/data/documents";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });
  return buildMetadata({
    locale,
    title: t("metaTitre"),
    description: t("metaDescription"),
    path: "",
    absoluteTitle: true,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [{ actualites }, documents] = await Promise.all([
    getActualitesPage(1),
    getDocumentsPublies(3),
  ]);

  return (
    <>
      <Hero />
      <HelpStrip />
      <MissionsSection />
      <AxesMarquee />
      <VisionSection />
      <StatsSection />
      <EngageSection />
      <LatestNews actualites={actualites.slice(0, 3)} />
      <LatestDocuments documents={documents} />
    </>
  );
}
