import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

const SITE_NAME = "Primrose – La Sororité Active";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/**
 * Construit les metadata (title, description, Open Graph, hreflang) d'une page.
 * `path` est le chemin sans préfixe de locale (ex. "/formations").
 */
export function buildMetadata({
  locale,
  title,
  description,
  path,
}: {
  locale: string;
  title: string;
  description: string;
  path: string;
}): Metadata {
  const siteUrl = getSiteUrl();
  const localizedPath = (l: string) =>
    l === routing.defaultLocale ? path || "/" : `/${l}${path}`;
  const url = `${siteUrl}${localizedPath(locale)}`;

  // Pas d'`images` explicite ici : le fichier src/app/opengraph-image.tsx
  // fournit déjà og:image/twitter:image pour toutes les routes.
  return {
    title: `${title} · ${SITE_NAME}`,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${siteUrl}${localizedPath(l)}`])
      ),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
