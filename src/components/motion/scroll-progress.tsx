"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/** Fine barre de progression de lecture, fixée en haut de la fenêtre. */
export function ScrollProgress() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 z-[60] h-0.5 w-full origin-left bg-primrose-forest"
      aria-hidden
    />
  );
}
