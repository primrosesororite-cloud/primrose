import { describe, it, expect } from "vitest";
import { formatTaille, lignes, slugify } from "./format";

describe("formatTaille", () => {
  it("affiche les octets sans décimale", () => {
    expect(formatTaille(512)).toBe("512 o");
  });

  it("affiche une décimale sous 10 unités, avec virgule en français", () => {
    expect(formatTaille(2.5 * 1024 * 1024)).toBe("2,5 Mo");
  });

  it("arrondit au-delà de 10 unités", () => {
    expect(formatTaille(15.6 * 1024 * 1024)).toBe("16 Mo");
  });

  it("utilise les unités anglaises hors français", () => {
    expect(formatTaille(1024, "en")).toBe("1 KB");
  });
});

describe("slugify", () => {
  it("retire accents, ponctuation et majuscules", () => {
    expect(slugify("Rapport annuel 2025 : Violences & Société")).toBe(
      "rapport-annuel-2025-violences-societe"
    );
  });

  it("ne laisse pas de tiret en bordure", () => {
    expect(slugify("  — Guide pratique —  ")).toBe("guide-pratique");
  });
});

describe("lignes", () => {
  it("découpe par ligne, retire espaces et lignes vides", () => {
    expect(lignes("  Écoute \r\n\n Orientation\n  ")).toEqual(["Écoute", "Orientation"]);
  });

  it("renvoie une liste vide pour un texte vide", () => {
    expect(lignes("  \n ")).toEqual([]);
  });
});
