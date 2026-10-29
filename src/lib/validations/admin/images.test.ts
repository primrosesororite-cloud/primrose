import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { imageProjetFacultativeSchema, lienExterneSchema } from "./images";

const BUCKET = "https://projet.supabase.co/storage/v1/object/public/images-public/";

beforeEach(() => vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://projet.supabase.co"));
afterEach(() => vi.unstubAllEnvs());

describe("imageProjetFacultativeSchema", () => {
  it("accepte une image du bucket public du projet, ou rien", () => {
    expect(imageProjetFacultativeSchema.safeParse(`${BUCKET}partenaires/logo.webp`).success).toBe(true);
    expect(imageProjetFacultativeSchema.safeParse("").success).toBe(true);
  });

  it("refuse une image hébergée ailleurs", () => {
    expect(imageProjetFacultativeSchema.safeParse("https://exemple.com/logo.png").success).toBe(false);
    expect(
      imageProjetFacultativeSchema.safeParse("https://projet.supabase.co/storage/v1/object/public/documents-public/x.pdf").success
    ).toBe(false);
  });
});

describe("lienExterneSchema", () => {
  it("accepte http et https", () => {
    expect(lienExterneSchema.safeParse("https://partenaire.org").success).toBe(true);
    expect(lienExterneSchema.safeParse("http://partenaire.org").success).toBe(true);
  });

  it("refuse les adresses qui exécutent du code", () => {
    expect(lienExterneSchema.safeParse("javascript:alert(1)").success).toBe(false);
    expect(lienExterneSchema.safeParse("data:text/html,<script>").success).toBe(false);
  });
});
