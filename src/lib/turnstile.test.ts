import { describe, it, expect, afterEach, vi } from "vitest";
import { verifyTurnstile } from "./turnstile";

describe("verifyTurnstile", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("refuse un jeton vide quand la clé secrète est configurée", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    expect(await verifyTurnstile("", "203.0.113.1")).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("laisse passer en développement sans clé secrète", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    vi.stubEnv("NODE_ENV", "development");
    expect(await verifyTurnstile("", "203.0.113.1")).toBe(true);
  });

  it("refuse en production sans clé secrète (échec fermé)", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    vi.stubEnv("NODE_ENV", "production");
    expect(await verifyTurnstile("", "203.0.113.1")).toBe(false);
  });
});
