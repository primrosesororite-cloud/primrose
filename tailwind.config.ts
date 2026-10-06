import type { Config } from "tailwindcss";

/**
 * Charte graphique Primrose – La Sororité Active.
 * Source de vérité des couleurs nommées (chargée par src/app/globals.css
 * via `@config`). Ne jamais utiliser une couleur hors de cette palette :
 * toute nouvelle teinte doit être déclarée ici d'abord.
 *
 * Couleurs extraites/affinées à partir de la maquette (échantillonnage pixel) :
 * - primrose-green      : fonds sauge (héro, footer, pastille d'onglet actif, icônes)
 * - primrose-green-dark : vert sauge moyen pour les titres et les boutons
 * - primrose-cream      : fonds de section (navbar, "Notre vision", "Nos missions")
 * - primrose-ink        : texte courant
 * - primrose-alert      : bouton "Contact – Besoin d'aide" UNIQUEMENT
 * - primrose-white      : fond des cartes
 * - primrose-charcoal   : bandeau sombre sous le footer ("Retour en haut")
 * - primrose-forest     : vert profond institutionnel (footer, bandeau vision,
 *                         petits textes verts : le green-dark échoue au contraste
 *                         AA en petit corps sur fond crème)
 */
const config: Config = {
  theme: {
    extend: {
      colors: {
        "primrose-green": "#81A484",
        "primrose-green-dark": "#55785A",
        "primrose-cream": "#EAF4EA",
        "primrose-ink": "#3A2E2A",
        "primrose-alert": "#BE3E37",
        "primrose-white": "#FFFFFF",
        "primrose-charcoal": "#5F6255",
        "primrose-forest": "#34503B",
      },
      borderRadius: {
        card: "1rem", // 16px, charte : cartes à coins arrondis
      },
      boxShadow: {
        // "Ombre douce" de la charte pour les cartes (fond blanc, icône verte)
        card: "0 10px 30px -12px rgb(58 46 36 / 0.18)",
      },
    },
  },
};

export default config;

