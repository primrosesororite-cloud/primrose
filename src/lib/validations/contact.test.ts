import { describe, it, expect } from "vitest";
import { contactSchema } from "./contact";

const valid = {
  nom: "Awa Nzila",
  email: "awa@example.com",
  telephone: "",
  sujet: "Question",
  message: "Bonjour, j'aimerais en savoir plus sur vos actions.",
  website: "",
  turnstileToken: "token-123",
};

describe("contactSchema", () => {
  it("accepte des données valides", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejette un e-mail invalide", () => {
    const result = contactSchema.safeParse({ ...valid, email: "pas-un-email" });
    expect(result.success).toBe(false);
  });

  it("rejette un message trop court", () => {
    const result = contactSchema.safeParse({ ...valid, message: "hi" });
    expect(result.success).toBe(false);
  });

  it("rejette un nom trop court", () => {
    const result = contactSchema.safeParse({ ...valid, nom: "A" });
    expect(result.success).toBe(false);
  });

  it("rejette si le honeypot (website) est rempli", () => {
    const result = contactSchema.safeParse({ ...valid, website: "http://spam.example" });
    expect(result.success).toBe(false);
  });

});
