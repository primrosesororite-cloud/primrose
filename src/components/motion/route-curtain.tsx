"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import { EASE } from "@/lib/motion";

/**
 * Double rideau (vert forêt puis sauge) qui se relève à chaque changement
 * de page, avec le sceau PrimROSE qui s'efface au centre. Jamais au premier
 * chargement (aucun impact sur le LCP), jamais sous mouvement réduit, sans
 * bloquer les clics — et jamais vers /besoin-d-aide : une personne en danger
 * doit voir la page d'aide immédiatement, sans effet qui retarde l'accès.
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

  const versAide = pathname.startsWith("/besoin-d-aide");
  if (navigations === 0 || shouldReduceMotion || versAide) return null;

  return (
    <div key={navigations} aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
        style={{ originY: 0 }}
        className="absolute inset-0 bg-primrose-green"
      />
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.04 }}
        style={{ originY: 0 }}
        className="absolute inset-0 bg-primrose-forest"
      />
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.8, y: -24 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="absolute left-1/2 top-1/2 -ml-12 -mt-12 h-24 w-24 overflow-hidden rounded-full border-4 border-primrose-white bg-primrose-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]"
      >
        <Image
          src="/primrose-logo.png"
          alt=""
          fill
          sizes="96px"
          className="object-cover [clip-path:circle(48%_at_50%_50%)]"
        />
      </motion.div>
    </div>
  );
}
