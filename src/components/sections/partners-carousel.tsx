"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";
import type { Database } from "@/types/database";

type Partenaire = Database["public"]["Tables"]["partenaires"]["Row"];

export function PartnersCarousel({ partenaires }: { partenaires: Partenaire[] }) {
  const t = useTranslations("aPropos");
  const shouldReduceMotion = useReducedMotion();
  const [dragging, setDragging] = useState(false);

  if (partenaires.length === 0) {
  return (
  <section className="border-t border-primrose-ink/10 px-4 py-16 text-center md:px-6 md:py-20">
  <SectionHeading title={t("partenairesTitre")} align="center" />
  <p className="mt-4 text-primrose-ink/75">{t("partenairesAVenir")}</p>
  </section>
  );
  }

  const looped = [...partenaires, ...partenaires];

  return (
  <section className="border-t border-primrose-ink/10 py-16 md:py-20">
  <SectionHeading title={t("partenairesTitre")} align="center" className="px-4" />

  {/* Le défilement continu (CSS, peu coûteux) vit sur l'élément interne ;
  le geste tactile (Framer Motion) s'applique au conteneur externe,
  pour que les deux transforms ne se disputent pas la même propriété. */}
  <div className="mt-8 cursor-grab overflow-hidden active:cursor-grabbing">
  <motion.div
  drag="x"
  dragConstraints={{ left: -240, right: 240 }}
  dragElastic={0.15}
  dragSnapToOrigin
  onDragStart={() => setDragging(true)}
  onDragEnd={() => setDragging(false)}
  >
  <div
  className={cn(
"flex w-max items-center gap-12",
  !shouldReduceMotion && "animate-marquee",
  dragging && "[animation-play-state:paused]"
  )}
  >
  {looped.map((partenaire, index) => (
  <a
  key={`${partenaire.id}-${index}`}
  href={partenaire.lien ?? undefined}
  target={partenaire.lien ? "_blank" : undefined}
  rel={partenaire.lien ? "noopener noreferrer" : undefined}
  draggable={false}
  className="flex h-14 w-32 shrink-0 items-center justify-center grayscale transition-all hover:grayscale-0"
  >
  {partenaire.logo_url ? (
  <Image
  src={partenaire.logo_url}
  alt={partenaire.nom}
  width={128}
  height={56}
  draggable={false}
  className="max-h-14 w-auto object-contain"
  />
  ) : (
  <span className="text-sm font-medium text-primrose-ink/75">
  {partenaire.nom}
  </span>
  )}
  </a>
  ))}
  </div>
  </motion.div>
  </div>
  </section>
  );
}
