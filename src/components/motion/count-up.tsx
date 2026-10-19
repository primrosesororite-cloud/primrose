"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import { DURATION } from "@/lib/motion";

/**
 * Nombre qui monte de 0 à `valeur` quand il entre à l'écran. Le HTML serveur
 * contient déjà la valeur finale (lisible sans JavaScript, sans écart
 * d'hydratation) ; l'animation écrit directement dans le DOM, image par image,
 * sans re-rendu React. Aucune animation sous mouvement réduit.
 */
export function CountUp({ valeur, suffixe = "" }: { valeur: number; suffixe?: string }) {
  const locale = useLocale();
  const ref = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const visible = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    const element = ref.current;
    if (!visible || shouldReduceMotion || !element) return;

    const format = new Intl.NumberFormat(locale);
    const controls = animate(0, valeur, {
      duration: DURATION.slow * 2.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        element.textContent = `${format.format(Math.round(v))}${suffixe}`;
      },
    });
    return () => controls.stop();
  }, [visible, valeur, suffixe, locale, shouldReduceMotion]);

  const final = `${new Intl.NumberFormat(locale).format(valeur)}${suffixe}`;

  return (
    <>
      <span className="sr-only">{final}</span>
      <span ref={ref} aria-hidden className="tabular-nums">
        {final}
      </span>
    </>
  );
}
