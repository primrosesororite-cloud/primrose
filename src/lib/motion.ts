import type { Variants } from "framer-motion";

/**
 * Système d'animation centralisé (charte : 0,3–0,7 s, easing doux, ton sobre).
 * Dans les composants, passer `shouldReduceMotion ? reducedMotionVariant : <variant>`
 * (voir `useReducedMotion` de framer-motion) plutôt qu'un variant animé brut,
 * pour respecter `prefers-reduced-motion`. `AnimateIn` fait déjà ce choix.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

/** Alias historique de `fadeUp`, conservé pour ne pas casser les imports existants. */
export const fadeInUp = fadeUp;

export const slideIn: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

/** Alias historique de `stagger`, conservé pour ne pas casser les imports existants. */
export const staggerContainer = stagger;

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: EASE },
  },
};

/** Variante statique (aucune animation) pour prefers-reduced-motion. */
export const reducedMotionVariant: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};
