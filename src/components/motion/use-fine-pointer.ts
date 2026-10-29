"use client";

import { useMediaQuery } from "@/components/motion/use-media-query";

/**
 * Vrai seulement avec une souris/un pavé et sans demande de mouvement réduit :
 * les effets liés au curseur (inclinaison 3D, magnétisme, halo) sont inutiles
 * au doigt et coûteux sur les téléphones d'entrée de gamme.
 */
export function useFinePointer() {
  return useMediaQuery("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
}
