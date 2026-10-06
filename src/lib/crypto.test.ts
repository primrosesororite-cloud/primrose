import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { randomBytes } from "crypto";
import { encryptField, decryptField } from "./crypto";

const ORIGINAL_KEY = process.env.DEMANDES_AIDE_ENCRYPTION_KEY;

describe("crypto (chiffrement demandes_aide)", () => {
  beforeEach(() => {
    process.env.DEMANDES_AIDE_ENCRYPTION_KEY = randomBytes(32).toString("base64");
  });

  afterEach(() => {
    process.env.DEMANDES_AIDE_ENCRYPTION_KEY = ORIGINAL_KEY;
  });

  it("déchiffre exactement ce qui a été chiffré", () => {
    const plaintext = "+242 06 123 45 67";
    const encrypted = encryptField(plaintext);
    expect(decryptField(encrypted)).toBe(plaintext);
  });

  it("gère les caractères accentués et longs messages", () => {
    const plaintext = "Bénévole intéressée, merci de me répondre à l'adresse indiquée. ".repeat(20);
    const encrypted = encryptField(plaintext);
    expect(decryptField(encrypted)).toBe(plaintext);
  });

  it("produit un résultat différent à chaque appel (IV aléatoire)", () => {
    const plaintext = "whatsapp: +242 00 000 00 00";
    const a = encryptField(plaintext);
    const b = encryptField(plaintext);
    expect(a).not.toBe(b);
    expect(decryptField(a)).toBe(plaintext);
    expect(decryptField(b)).toBe(plaintext);
  });

  it("refuse de chiffrer sans clé configurée (échec volontairement bloquant)", () => {
    delete process.env.DEMANDES_AIDE_ENCRYPTION_KEY;
    expect(() => encryptField("test")).toThrow();
  });

  it("refuse une clé de mauvaise longueur", () => {
    process.env.DEMANDES_AIDE_ENCRYPTION_KEY = Buffer.from("trop-courte").toString("base64");
    expect(() => encryptField("test")).toThrow();
  });

  it("échoue proprement sur un texte chiffré corrompu", () => {
    const encrypted = encryptField("valeur secrète");
    const tampered = encrypted.slice(0, -4) + "abcd";
    expect(() => decryptField(tampered)).toThrow();
  });
});
