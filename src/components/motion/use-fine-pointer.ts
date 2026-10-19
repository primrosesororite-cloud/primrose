"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribe(callback: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

/**
 * Vrai seulement avec une souris/un pavé et sans demande de mouvement réduit :
 * les effets liés au curseur (inclinaison 3D, magnétisme) sont inutiles au
 * doigt et coûteux sur les téléphones d'entrée de gamme.
 */
export function useFinePointer() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
