"use client";

import { useSyncExternalStore } from "react";

/**
 * Vrai si la media query correspond. Faux côté serveur et au premier rendu
 * (pas d'écart d'hydratation) : les effets réservés à certains écrans ne
 * s'activent qu'une fois le navigateur connu.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
