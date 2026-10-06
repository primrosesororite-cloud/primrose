"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Chevron sauge + deux bandes qui convergent vers le sceau au chargement. */
export function HeroBands() {
  const shouldReduceMotion = useReducedMotion();

  // Mêmes props au rendu serveur et client (pas d'hydratation divergente) :
  // seule la durée change quand le mouvement réduit est demandé.
  const grow = (originX: number, delay: number) => ({
    initial: { scaleX: 0 },
    animate: { scaleX: 1 },
    transition: shouldReduceMotion ? { duration: 0 } : { duration: 0.7, delay, ease: EASE },
    style: { originX },
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] overflow-hidden sm:h-[27rem]">
      <div className="absolute inset-0 bg-primrose-green/75 [clip-path:polygon(0_0,100%_0,100%_60%,50%_100%,0_60%)]" />
      <div className="absolute left-1/2 top-[52%] h-3 w-[72%] -translate-x-[80%] -translate-y-1/2 -rotate-[15deg] sm:h-4">
        <motion.span {...grow(0, 0.15)} className="block h-full w-full rounded-full bg-primrose-forest/45" />
      </div>
      <div className="absolute left-1/2 top-[52%] h-3 w-[72%] translate-x-[8%] -translate-y-1/2 rotate-[15deg] sm:h-4">
        <motion.span {...grow(1, 0.15)} className="block h-full w-full rounded-full bg-primrose-forest/45" />
      </div>
    </div>
  );
}
