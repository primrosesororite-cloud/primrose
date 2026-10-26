import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl } from "./seo";

afterEach(() => vi.unstubAllEnvs());

describe("getSiteUrl", () => {
  it("utilise NEXT_PUBLIC_SITE_URL sans barre finale", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.sororiteprimrose.org/");
    expect(getSiteUrl()).toBe("https://www.sororiteprimrose.org");
  });

  it("n'expose jamais localhost en production Vercel", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    expect(getSiteUrl()).toBe("https://www.sororiteprimrose.org");
  });

  it("retombe sur l'adresse officielle en production si la variable manque", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl()).toBe("https://www.sororiteprimrose.org");
  });

  it("garde localhost en développement", () => {
    vi.stubEnv("VERCEL_ENV", "");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});
