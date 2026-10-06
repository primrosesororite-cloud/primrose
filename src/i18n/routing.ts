import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  // Le public visé est francophone (Congo-Brazzaville) : la détection
  // automatique via Accept-Language servirait de l'anglais par défaut à des
  // visiteurs dont le navigateur est configuré en anglais alors qu'ils sont
  // francophones. "/" reste toujours en français ; /en reste accessible
  // explicitement.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
