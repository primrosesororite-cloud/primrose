import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { HelpStrip } from "@/components/sections/help-strip";
import { MissionsSection } from "@/components/sections/missions-section";
import { VisionSection } from "@/components/sections/vision-section";
import { EngageSection } from "@/components/sections/engage-section";
import { LatestNews } from "@/components/sections/latest-news";
import { getActualitesPage, getDernieresActualites } from "@/lib/data/actualites";
import { NewsTicker } from "@/components/sections/news-ticker";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { actualites } = await getActualitesPage(1);
  const dernieres = await getDernieresActualites();

  return (
    <>
      <Hero />
      <NewsTicker items={dernieres} />
      <HelpStrip />
      <MissionsSection />
      <VisionSection />
      <EngageSection />
      <LatestNews actualites={actualites.slice(0, 3)} />
    </>
  );
}
