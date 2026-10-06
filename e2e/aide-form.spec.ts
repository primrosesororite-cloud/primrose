import { test, expect } from "@playwright/test";

test.describe("Parcours /besoin-d-aide (sensible)", () => {
  test("affiche le message rassurant et le formulaire", async ({ page }) => {
    await page.goto("/besoin-d-aide");
    await expect(
      page.getByRole("heading", { name: /vous n.êtes pas seule/i })
    ).toBeVisible();
    await expect(page.getByLabel(/votre coordonnée/i)).toBeVisible();
  });

  test("ne pose aucun cookie autre que la langue (NEXT_LOCALE)", async ({ page, context }) => {
    await page.goto("/besoin-d-aide");
    const cookies = await context.cookies();
    const names = cookies.map((c) => c.name);
    expect(names.every((n) => n === "NEXT_LOCALE")).toBe(true);
  });

  test("le formulaire refuse un envoi sans coordonnée (validation client)", async ({ page }) => {
    await page.goto("/besoin-d-aide");
    await page.getByRole("button", { name: /envoyer en toute confidentialité/i }).click();
    await expect(page.getByLabel(/votre coordonnée/i)).toBeVisible();
    // La coordonnée reste vide : la soumission ne doit pas afficher le message de confirmation.
    await expect(page.getByRole("status")).toHaveCount(0);
  });

  test("le champ honeypot est présent mais masqué visuellement", async ({ page }) => {
    await page.goto("/besoin-d-aide");
    const honeypot = page.locator("#website");
    await expect(honeypot).toBeHidden();
  });
});
