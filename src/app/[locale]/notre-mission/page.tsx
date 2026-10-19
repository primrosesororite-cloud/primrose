import { setRequestLocale, getTranslations } from "next-intl/server";
import { Megaphone, HeartHandshake, Flag, GraduationCap } from "lucide-react";
import { MissionDetailSection } from "@/components/sections/mission-detail-section";
import { PageHeader } from "@/components/sections/page-header";
import { buildMetadata } from "@/lib/seo";
import { getMissions, type AxeKey } from "@/lib/data/contenus";

const ICONS = {
  prevenir: Megaphone,
  soutenir: HeartHandshake,
  plaider: Flag,
  former: GraduationCap,
} as const satisfies Record<AxeKey, unknown>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "missions" });
  return buildMetadata({
    locale,
    title: t("titre"),
    description: t("texte"),
    path: "/notre-mission",
  });
}

export default async function NotreMissionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("missions");
  const missions = await getMissions(locale);

  return (
    <div>
      <PageHeader eyebrow={t("eyebrow")} title={t("titre")} intro={t("texte")} />

      <div className="divide-y divide-primrose-ink/10">
        {missions.map((mission, index) => {
          const Icon = ICONS[mission.key];
          return (
            <MissionDetailSection
              key={mission.key}
              mission={mission}
              icon={
                <Icon
                  aria-hidden
                  className="h-20 w-20 text-primrose-forest"
                  strokeWidth={1.4}
                />
              }
              reverse={index % 2 === 1}
            />
          );
        })}
      </div>
    </div>
  );
}
