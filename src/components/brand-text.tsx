import { Fragment } from "react";

const MARQUE = "PrimROSE";
// Mot entier uniquement : « sororiteprimrose.org » ou un autre mot ne sont pas touchés.
const MOTIF = /\b(PrimROSE)\b/;

/**
 * Affiche le nom de l'association en gras italique dans un texte, partout
 * où il apparaît. Sans effet sur le reste du texte ; fonctionne côté serveur
 * comme côté client. Réservé aux textes affichés : les titres de page, les
 * descriptions pour les moteurs de recherche et les libellés d'accessibilité
 * ne peuvent pas porter de mise en forme.
 */
export function BrandText({ children }: { children: string }) {
  return (
    <>
      {children.split(MOTIF).map((morceau, index) =>
        morceau === MARQUE ? (
          <span key={index} className="font-bold italic">
            {MARQUE}
          </span>
        ) : (
          <Fragment key={index}>{morceau}</Fragment>
        )
      )}
    </>
  );
}
