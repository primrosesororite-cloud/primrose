"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Défilement fluide (inertie douce) à la souris et au pavé tactile. Sur
 * écran tactile, le défilement natif est conservé (Lenis ne lisse pas le
 * toucher par défaut) ; désactivé sous prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      lerp: 0.1,
      wheelMultiplier: 1,
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
