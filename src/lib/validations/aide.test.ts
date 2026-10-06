import { describe, it, expect } from "vitest";
import { aideSchema } from "./aide";

const valid = {
  moyenContact: "whatsapp" as const,
  coordonnee: "+242 06 123 45 67",
  message: "",
  urgence: "normal" as const,
  nePasRecontacterAvant: "",
  website: "",
  turnstileToken: "token-123",
};

describe("aideSchema", () => {
  it("accepte une demande minimale valide", () => {
    expect(aideSchema.safeParse(valid).success).toBe(true);
  });

  it("n'exige aucun champ superflu (message, date facultatifs)", () => {
    const rest = { ...valid };
    delete (rest as Partial<typeof valid>).message;
    delete (rest as Partial<typeof valid>).nePasRecontacterAvant;
    expect(aideSchema.safeParse(rest).success).toBe(true);
  });

  it("rejette un moyen de contact hors énumération", () => {
    const result = aideSchema.safeParse({ ...valid, moyenContact: "sms" });
    expect(result.success).toBe(false);
  });

  it("rejette une coordonnée trop courte", () => {
    const result = aideSchema.safeParse({ ...valid, coordonnee: "a" });
    expect(result.success).toBe(false);
  });

  it("accepte une date « ne pas recontacter avant » au format AAAA-MM-JJ", () => {
    const result = aideSchema.safeParse({ ...valid, nePasRecontacterAvant: "2026-12-01" });
    expect(result.success).toBe(true);
  });

  it("rejette une date mal formée", () => {
    const result = aideSchema.safeParse({ ...valid, nePasRecontacterAvant: "01/12/2026" });
    expect(result.success).toBe(false);
  });

  it("rejette si le honeypot est rempli", () => {
    const result = aideSchema.safeParse({ ...valid, website: "spam" });
    expect(result.success).toBe(false);
  });
});
