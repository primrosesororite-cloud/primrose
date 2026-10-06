"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import { reducedMotionVariant, fadeIn } from "@/lib/motion";

/**
 * Fondu à l'arrivée sur chaque page. Pas d'animation de sortie : avec
 * AnimatePresence + App Router, la sortie peut ne jamais se terminer et laisser
 * le contenu bloqué à opacité 0 (page blanche au retour).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial="hidden"
      animate="visible"
      variants={shouldReduceMotion ? reducedMotionVariant : fadeIn}
    >
      {children}
    </motion.div>
  );
}
