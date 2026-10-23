"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { MissionContent } from "@/lib/data/contenus";

const revealGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

const revealItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export function MissionDetailSection({
  mission,
  icon,
  reverse = false,
}: {
  mission: MissionContent;
  icon: React.ReactNode;
  reverse?: boolean;
}) {
  const t = useTranslations("missions");
  const shouldReduceMotion = useReducedMotion();
  const { key: missionKey, valeurs, actions } = mission;

  return (
    <section
      id={missionKey}
      className="mx-auto grid max-w-6xl scroll-mt-28 items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-16 md:px-6 md:py-24"
    >
      <div className={cn("flex justify-center", reverse && "md:order-2")}>
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.78, rotate: -9, y: 22 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.8 }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.035 }}
          className="relative flex h-56 w-56 items-center justify-center md:h-64 md:w-64"
        >
          <span aria-hidden className="mission-orbit absolute inset-[-1.25rem] rounded-full border border-dashed border-primrose-green/35 md:inset-[-1.75rem]" />
          <span aria-hidden className="mission-orbit-reverse absolute inset-[-0.35rem] rounded-full border border-primrose-green/15" />
          <span aria-hidden className="absolute inset-5 rounded-full bg-primrose-green/25 blur-2xl" />
          <span className="relative z-10 flex h-full w-full items-center justify-center rounded-full border border-white/90 bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.98),rgba(234,244,234,0.94)_48%,rgba(201,224,201,0.8))] shadow-[0_28px_65px_-36px_rgba(42,79,51,0.6),inset_0_2px_0_rgba(255,255,255,0.95)] ring-1 ring-primrose-green/20 backdrop-blur-xl">
            <motion.span
              aria-hidden
              animate={shouldReduceMotion ? undefined : { y: [0, -7, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 flex text-primrose-forest drop-shadow-[0_8px_15px_rgba(52,80,59,0.14)]"
            >
              {icon}
            </motion.span>
            <span aria-hidden className="absolute bottom-[16%] h-2 w-20 rounded-full bg-primrose-forest/10 blur-md" />
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.2 }}
        variants={revealGroup}
        className={cn(reverse && "md:order-1")}
      >
        <motion.h2 variants={revealItem} className="font-sans text-sm font-bold tracking-[0.16em] text-primrose-forest">
          {mission.titre}
        </motion.h2>
        <motion.p variants={revealItem} className="mt-4 font-serif text-2xl leading-snug text-primrose-ink md:text-[1.9rem]">{mission.description}</motion.p>
        <motion.p variants={revealItem} className="mt-4 text-base leading-relaxed text-primrose-ink/80 md:text-lg">{mission.detail}</motion.p>

        <motion.h3 variants={revealItem} className="mt-8 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-primrose-forest">
          {t("concretement")}
        </motion.h3>
        <ul className="mt-4 space-y-3">
          {actions.map((action, index) => (
            <motion.li
              key={action}
              variants={revealItem}
              whileHover={shouldReduceMotion ? undefined : { x: 4 }}
              transition={{ duration: 0.22 }}
              className="flex items-start gap-3 text-primrose-ink"
            >
              <motion.span
                initial={shouldReduceMotion ? false : { scale: 0.7 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.2 + index * 0.08 }}
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primrose-green/30 text-primrose-forest"
              >
                <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
              </motion.span>
              {action}
            </motion.li>
          ))}
        </ul>

        {valeurs?.length > 0 && (
          <motion.ul variants={revealGroup} className="mt-8 flex flex-wrap gap-2">
            {valeurs.map((valeur) => (
              <motion.li
                key={valeur}
                variants={revealItem}
                whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                className="glass-surface rounded-full px-3.5 py-1.5 text-xs font-semibold text-primrose-ink"
              >
                {valeur}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </motion.div>
    </section>
  );
}
