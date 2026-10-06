"use client";

import { useEffect, useRef } from "react";

const NEUTRAL_URL = "https://www.weather.com";
const DOUBLE_PRESS_MS = 600;

/** Double appui sur Échap : quitte immédiatement le site vers une page neutre. */
export function useDoubleEscapeExit(enabled: boolean) {
  const lastEscapeRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      const now = Date.now();
      if (now - lastEscapeRef.current < DOUBLE_PRESS_MS) {
        window.location.replace(NEUTRAL_URL);
        return;
      }
      lastEscapeRef.current = now;
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);
}
