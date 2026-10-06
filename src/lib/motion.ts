import type { Variants } from "framer-motion";

/**
 * Mouvement calme : fondus uniquement, sans glissement, zoom ni rebond
 * (demande de sobriété). Durées 0,3 à 0,7 s. Respect de prefers-reduced-motion
 * via MotionConfig (voir MotionProvider).
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

/** Variante statique pour les composants qui gèrent eux-mêmes prefers-reduced-motion. */
export const reducedMotionVariant: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};
