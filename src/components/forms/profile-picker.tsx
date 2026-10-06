"use client";

import { useTranslations } from "next-intl";
import { UserPlus, HandHeart, Handshake, Gift } from "lucide-react";
import { AnimateIn } from "@/components/motion/animate-in";
import { stagger } from "@/lib/motion";
import { JoinRowContent, joinRowClass } from "@/components/sections/join-row";

const PROFILES = [
  { type: "membre", Icon: UserPlus },
  { type: "benevole", Icon: HandHeart },
  { type: "partenaire", Icon: Handshake },
  { type: "donateur", Icon: Gift },
] as const;

export function ProfilePicker({
  onSelect,
}: {
  onSelect: (type: (typeof PROFILES)[number]["type"]) => void;
}) {
  const t = useTranslations("home.engager.items");

  return (
    <AnimateIn variants={stagger}>
      <ul className="border-t border-primrose-ink/15">
        {PROFILES.map(({ type, Icon }) => (
          <li key={type} className="border-b border-primrose-ink/15">
            <AnimateIn>
              <button type="button" onClick={() => onSelect(type)} className={joinRowClass}>
                <JoinRowContent Icon={Icon} titre={t(`${type}.titre`)} texte={t(`${type}.texte`)} />
              </button>
            </AnimateIn>
          </li>
        ))}
      </ul>
    </AnimateIn>
  );
}
