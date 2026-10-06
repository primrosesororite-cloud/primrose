import { describe, it, expect } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  it("autorise les requêtes sous la limite", () => {
    const key = `test-under-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit(key, { max: 5, windowMs: 60_000 }).allowed).toBe(true);
    }
  });

  it("bloque au-delà du maximum autorisé dans la fenêtre", () => {
    const key = `test-over-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, { max: 5, windowMs: 60_000 });
    }
    expect(checkRateLimit(key, { max: 5, windowMs: 60_000 }).allowed).toBe(false);
  });

  it("isole les compteurs par clé (par IP)", () => {
    const keyA = `test-a-${Math.random()}`;
    const keyB = `test-b-${Math.random()}`;
    for (let i = 0; i < 5; i++) checkRateLimit(keyA, { max: 5, windowMs: 60_000 });

    expect(checkRateLimit(keyA, { max: 5, windowMs: 60_000 }).allowed).toBe(false);
    expect(checkRateLimit(keyB, { max: 5, windowMs: 60_000 }).allowed).toBe(true);
  });

  it("laisse passer à nouveau une fois la fenêtre expirée", () => {
    const key = `test-window-${Math.random()}`;
    for (let i = 0; i < 3; i++) checkRateLimit(key, { max: 3, windowMs: 10 });
    expect(checkRateLimit(key, { max: 3, windowMs: 10 }).allowed).toBe(false);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(checkRateLimit(key, { max: 3, windowMs: 10 }).allowed).toBe(true);
        resolve();
      }, 20);
    });
  });
});
