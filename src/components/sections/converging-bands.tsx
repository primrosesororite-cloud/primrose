"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Deux traits qui se dessinent depuis les bords vers la pointe du chevron. */
export function ConvergingBands() {
  const shouldReduceMotion = useReducedMotion();
  const draw = (originX: number) => ({
    initial: { scaleX: 0 },
    animate: { scaleX: 1 },
    transition: shouldReduceMotion ? { duration: 0 } : { duration: 0.9, delay: 0.2, ease: EASE },
    style: { originX },
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <span className="absolute bottom-10 right-1/2 h-1 w-[58%] rotate-[7deg] md:bottom-16 md:h-1.5">
        <motion.span {...draw(0)} className="block h-full w-full rounded-full bg-primrose-green/40" />
      </span>
      <span className="absolute bottom-10 left-1/2 h-1 w-[58%] -rotate-[7deg] md:bottom-16 md:h-1.5">
        <motion.span {...draw(1)} className="block h-full w-full rounded-full bg-primrose-green/40" />
      </span>
    </div>
  );
}
