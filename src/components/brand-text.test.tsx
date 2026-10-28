import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BrandText } from "./brand-text";

const rendu = (texte: string) => renderToStaticMarkup(<BrandText>{texte}</BrandText>);

describe("BrandText", () => {
  it("met le nom en gras italique au milieu d'une phrase", () => {
    expect(rendu("En République du Congo, PrimROSE écoute")).toBe(
      'En République du Congo, <span class="font-bold italic">PrimROSE</span> écoute'
    );
  });

  it("met en forme chaque occurrence", () => {
    expect(rendu("PrimROSE – La Sororité Active, par PrimROSE").match(/font-bold italic/g)).toHaveLength(2);
  });

  it("laisse intact un texte sans le nom, ou une adresse qui le contient", () => {
    expect(rendu("Bonjour à toutes")).toBe("Bonjour à toutes");
    expect(rendu("accueil@sororiteprimrose.org")).toBe("accueil@sororiteprimrose.org");
  });
});
