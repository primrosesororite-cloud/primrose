import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/seo";
import { createPublicClient } from "@/lib/supabase/public";

const STATIC_PATHS = [
  "",
  "/a-propos",
  "/notre-mission",
  "/formations",
  "/evenements",
  "/rejoindre",
  "/actualites",
  "/documents",
  "/contact",
  "/besoin-d-aide",
  "/mentions-legales",
  "/politique-de-confidentialite",
];

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function withLocales(
  path: string,
  siteUrl: string,
  lastModified?: string | null
): MetadataRoute.Sitemap[number] {
  const url =
    path === ""
      ? `${siteUrl}/`
      : `${siteUrl}${path}`;

  return {
    url,
    ...(lastModified && { lastModified }),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale
            ? `${siteUrl}${path || "/"}`
            : `${siteUrl}/${l}${path}`,
        ])
      ),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const entries = STATIC_PATHS.map((path) => withLocales(path, siteUrl));

  if (!isSupabaseConfigured) return entries;

  const supabase = createPublicClient();

  const [{ data: actualites }, { data: formations }, { data: documents }] = await Promise.all([
    supabase.from("actualites").select("slug, updated_at").eq("publie", true),
    supabase.from("formations").select("slug, updated_at").neq("statut", "brouillon"),
    supabase.from("documents").select("slug, updated_at").eq("publie", true),
  ]);

  actualites?.forEach((a) => entries.push(withLocales(`/actualites/${a.slug}`, siteUrl, a.updated_at)));
  formations?.forEach((f) => entries.push(withLocales(`/formations/${f.slug}`, siteUrl, f.updated_at)));
  documents?.forEach((d) => entries.push(withLocales(`/documents/${d.slug}`, siteUrl, d.updated_at)));

  return entries;
}
