import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

const SITE_NAME = "PrimROSE – La Sororité Active";

/** Adresse officielle, utilisée en production si NEXT_PUBLIC_SITE_URL manque ou vaut localhost. */
const SITE_URL_PRODUCTION = "https://www.sororiteprimrose.org";

/**
 * Adresse publique du site (liens canoniques, og:url, sitemap, JSON-LD).
 * En production sur Vercel, jamais « localhost » : une variable absente ou
 * mal réglée ne doit pas casser le référencement ni les aperçus de partage.
 */
export function getSiteUrl(): string {
  const configuree = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  const invalide = !configuree || configuree.includes("localhost");
  if (process.env.VERCEL_ENV === "production" && invalide) return SITE_URL_PRODUCTION;
  return configuree || "http://localhost:3000";
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
  image,
  article,
  absoluteTitle = false,
  noindex = false,
}: {
  locale: string;
  title: string;
  description: string;
  path: string;
  image?: string | null;
  article?: { publishedTime?: string | null };
  /** Titre complet tel quel (accueil), sans suffixe du nom du site. */
  absoluteTitle?: boolean;
  /** Page à garder hors des moteurs de recherche (connexion, pages internes). */
  noindex?: boolean;
}): Metadata {
  const siteUrl = getSiteUrl();
  const localizedPath = (l: string) =>
    l === routing.defaultLocale ? path || "/" : `/${l}${path}`;
  const url = `${siteUrl}${localizedPath(locale)}`;

  const images = image ? [image] : undefined;
  return {
    title: absoluteTitle ? { absolute: title } : `${title} · ${SITE_NAME}`,
    description,
    ...(noindex && { robots: { index: false, follow: false } }),
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, `${siteUrl}${localizedPath(l)}`])),
        "x-default": `${siteUrl}${localizedPath(routing.defaultLocale)}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale,
      images,
      type: article ? "article" : "website",
      publishedTime: article?.publishedTime ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}
