import { useTranslations } from "next-intl";
import { UserPlus, HandHeart, Handshake, Gift } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AnimateIn } from "@/components/motion/animate-in";
import { staggerContainer } from "@/lib/motion";
import { SectionHeading } from "@/components/sections/section-heading";
import { JoinRowContent, joinRowClass } from "@/components/sections/join-row";

const PROFILS = [
  { key: "membre", Icon: UserPlus },
  { key: "benevole", Icon: HandHeart },
  { key: "partenaire", Icon: Handshake },
  { key: "donateur", Icon: Gift },
] as const;

export function EngageSection() {
  const t = useTranslations("home.engager");

  return (
    <section className="bg-primrose-white px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t("eyebrow")} title={t("titre")} text={t("texte")} />

        <AnimateIn variants={staggerContainer} className="mt-12">
          <ul className="border-t border-primrose-ink/15">
            {PROFILS.map(({ key, Icon }) => (
              <li key={key} className="border-b border-primrose-ink/15">
                <AnimateIn>
                  <Link href="/rejoindre" className={joinRowClass}>
                    <JoinRowContent Icon={Icon} titre={t(`items.${key}.titre`)} texte={t(`items.${key}.texte`)} />
                  </Link>
                </AnimateIn>
              </li>
            ))}
          </ul>
        </AnimateIn>
      </div>
    </section>
  );
}
