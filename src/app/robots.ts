import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/connexion", "/design-system"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
