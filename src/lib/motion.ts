import type { Variants } from "framer-motion";

/** Durées 0,3 à 0,7 s, easing doux. Respect de prefers-reduced-motion via MotionConfig. */

const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

/** Fondu avec une légère remontée (12 px) : entrée des blocs au défilement. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

export const reducedMotionVariant: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};
