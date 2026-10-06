import { describe, it, expect } from "vitest";
import { toCsv } from "./csv";

describe("toCsv", () => {
  it("génère un en-tête et des lignes correctement séparés par des virgules", () => {
    const csv = toCsv(
      [{ nom: "Awa", email: "awa@example.com" }],
      [
        { key: "nom", label: "Nom" },
        { key: "email", label: "E-mail" },
      ]
    );
    expect(csv).toBe("Nom,E-mail\r\nAwa,awa@example.com");
  });

  it("échappe les valeurs contenant une virgule ou des guillemets", () => {
    const csv = toCsv(
      [{ nom: 'Dupont, "Awa"' }],
      [{ key: "nom", label: "Nom" }]
    );
    expect(csv).toBe('Nom\r\n"Dupont, ""Awa"""');
  });

  it("échappe les valeurs contenant un saut de ligne", () => {
    const csv = toCsv([{ message: "ligne1\nligne2" }], [{ key: "message", label: "Message" }]);
    expect(csv).toBe('Message\r\n"ligne1\nligne2"');
  });

  it("convertit null/undefined en chaîne vide", () => {
    const csv = toCsv([{ telephone: null }], [{ key: "telephone", label: "Téléphone" }]);
    expect(csv).toBe("Téléphone\r\n");
  });

  it("gère un tableau de lignes vide (seulement l'en-tête)", () => {
    const csv = toCsv([], [{ key: "nom", label: "Nom" }]);
    expect(csv).toBe("Nom");
  });
});
