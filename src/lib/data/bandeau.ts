import { getTranslations } from "next-intl/server";
import { getDernieresActualites } from "@/lib/data/actualites";
import { getEvenementsPublies } from "@/lib/data/evenements";
import { getDocumentsPublies } from "@/lib/data/documents";

export type BandeauItem = {
  cle: string;
  etiquette: string;
  titre: string;
  href: string;
  /** Date courte affichée avant le titre (événements). */
  date?: string;
  /** Mise en avant de l'aide : seul usage autorisé du rouge de la charte. */
  aide?: boolean;
};

type Permanent = { etiquette: string; titre: string; href: string };

/**
 * Contenu du bandeau « À la une » : dernières actualités, événements à
 * venir, derniers documents, puis quelques messages permanents (aide,
 * engagement, ressources) pour qu'il reste vivant même quand peu de
 * contenus sont publiés.
 */
export async function getBandeau(locale: string): Promise<BandeauItem[]> {
  const t = await getTranslations({ locale, namespace: "bandeau" });
  const [actualites, evenements, documents] = await Promise.all([
    getDernieresActualites(6),
    getEvenementsPublies(),
    getDocumentsPublies(3),
  ]);

  const hier = Date.now() - 24 * 60 * 60 * 1000;
  const formatDate = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });

  return [
    ...actualites.map((a) => ({
      cle: `actualite-${a.id}`,
      etiquette: t("actualite"),
      titre: a.titre,
      href: `/actualites/${a.slug}`,
    })),
    ...evenements
      .filter((e) => new Date(e.date_evenement).getTime() >= hier)
      .slice(0, 3)
      .map((e) => ({
        cle: `evenement-${e.id}`,
        etiquette: t("evenement"),
        titre: e.titre,
        href: "/evenements",
        date: formatDate.format(new Date(e.date_evenement)),
      })),
    ...documents.map((d) => ({
      cle: `document-${d.id}`,
      etiquette: t("document"),
      titre: d.titre,
      href: `/documents/${d.slug}`,
    })),
    ...(t.raw("permanents") as Permanent[]).map((p, index) => ({
      cle: `permanent-${index}`,
      ...p,
      aide: p.href === "/besoin-d-aide",
    })),
  ];
}
