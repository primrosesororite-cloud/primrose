import { getSiteUrl } from "@/lib/seo";
import type { Database } from "@/types/database";

type Evenement = Database["public"]["Tables"]["evenements"]["Row"];
type ReseauSocial = Pick<
  Database["public"]["Tables"]["reseaux_sociaux"]["Row"],
  "plateforme" | "url"
>;

/** JSON-LD Organization, à placer une fois dans le layout racine. */
export function organizationJsonLd(reseaux: ReseauSocial[]) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Primrose – La Sororité Active",
    url: siteUrl,
    logo: `${siteUrl}/opengraph-image`,
    description:
      "Association congolaise engagée contre les violences de genre : prévenir, soutenir, plaider, former.",
    areaServed: {
      "@type": "Country",
      name: "Congo-Brazzaville",
    },
    sameAs: reseaux.map((r) => r.url),
  };
}

/** JSON-LD Event pour une entrée de la table `evenements`. */
export function evenementJsonLd(evenement: Evenement) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: evenement.titre,
    startDate: evenement.date_evenement,
    description: evenement.description ?? undefined,
    image: evenement.image_url ?? undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: evenement.lieu
      ? {
          "@type": "Place",
          name: evenement.lieu,
        }
      : undefined,
    organizer: {
      "@type": "NGO",
      name: "Primrose – La Sororité Active",
      url: siteUrl,
    },
  };
}
