"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import { EASE } from "@/lib/motion";

/**
 * Double rideau (vert forêt puis sauge) qui se relève à chaque changement
 * de page. Jamais au premier chargement (aucun impact sur le LCP), jamais
 * sous mouvement réduit, et sans bloquer les clics.
 */
export function RouteCurtain() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [previous, setPrevious] = useState(pathname);
  const [navigations, setNavigations] = useState(0);

  if (pathname !== previous) {
    setPrevious(pathname);
    setNavigations((n) => n + 1);
  }

  if (navigations === 0 || shouldReduceMotion) return null;

  return (
    <div key={navigations} aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
        style={{ originY: 0 }}
        className="absolute inset-0 bg-primrose-green"
      />
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        style={{ originY: 0 }}
        className="absolute inset-0 bg-primrose-forest"
      />
    </div>
  );
}
