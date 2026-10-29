import type { Transition, Variants } from "framer-motion";

/**
 * Système de mouvement Primrose. Durées 0,3 à 0,7 s, easing doux, jamais
 * de rebond agressif. Uniquement opacity / transform / clip-path (animés par
 * le GPU, pas de reflow) pour rester fluide sur mobile d'entrée de gamme.
 * prefers-reduced-motion est respecté globalement via MotionConfig.
 */

/** Easing « expo out » : départ franc, arrivée très douce. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.3,
  base: 0.5,
  slow: 0.7,
} as const;

/** Ressort amorti pour les éléments qui se déplacent (pastilles, indicateurs). */
export const SPRING: Transition = { type: "spring", stiffness: 380, damping: 34, mass: 0.9 };

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.base, ease: EASE } },
};

/** Perspective commune aux entrées en 3D (px) : assez lointaine pour rester sobre. */
const PERSPECTIVE = 1200;

/**
 * Entrée des blocs au défilement : remontée, fondu et légère bascule en
 * perspective, comme une page qui se redresse. Transform uniquement (GPU).
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: 9, scale: 0.98, transformPerspective: PERSPECTIVE },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transformPerspective: PERSPECTIVE,
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

/** Glissement latéral court : éléments de liste, menu mobile. */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: DURATION.fast + 0.05, ease: EASE } },
};

/** Légère mise à l'échelle depuis 96 % : cartes, médias, visuels. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: DURATION.slow, ease: EASE } },
};

/** Révélation par rideau (clip-path) : images et grands aplats. */
export const curtainReveal: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: { clipPath: "inset(0 0 0% 0)", transition: { duration: DURATION.slow, ease: EASE } },
};

/** Conteneur qui orchestre l'entrée en cascade de ses enfants (StaggerItem). */
export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

export const reducedMotionVariant: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};
