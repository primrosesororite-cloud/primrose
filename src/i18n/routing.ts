import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  // Le public visé est francophone (République du Congo) : la détection
  // automatique via Accept-Language servirait de l'anglais par défaut à des
  // visiteurs dont le navigateur est configuré en anglais alors qu'ils sont
  // francophones. "/" reste toujours en français ; /en reste accessible
  // explicitement.
  localeDetection: false,
  // Aucun cookie de langue : la langue vient de l'URL (/ ou /en). Un cookie
  // laisserait une trace de visite sur l'appareil, à proscrire pour les
  // personnes en danger (règle « aucun cookie » de /besoin-d-aide).
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];
