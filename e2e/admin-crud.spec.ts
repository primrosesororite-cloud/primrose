import { test, expect } from "@playwright/test";

/**
 * Nécessite un compte admin de test (Supabase de test/staging).
 * Ignoré automatiquement si E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD ne sont pas
 * fournies — évite de faire échouer la CI sur un environnement sans Supabase.
 */
const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD;

test.describe("CRUD admin — Chiffres clés", () => {
  test.skip(!email || !password, "E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD non fournis");

  test.beforeEach(async ({ page }) => {
    await page.goto("/connexion");
    await page.getByLabel(/e-mail/i).fill(email!);
    await page.getByLabel(/mot de passe/i).fill(password!);
    await page.getByRole("button", { name: /se connecter/i }).click();
    await page.waitForURL(/\/admin/);
  });

  test("créer, modifier puis supprimer un chiffre clé", async ({ page }) => {
    await page.goto("/admin/contenus");

    const libelle = `Test E2E ${Date.now()}`;

    await page.getByRole("button", { name: /ajouter un chiffre/i }).click();
    await page.getByLabel(/libellé/i).fill(libelle);
    await page.getByLabel(/^valeur$/i).fill("42");
    await page.getByRole("button", { name: /^enregistrer$/i }).click();
    await expect(page.getByText(libelle)).toBeVisible();

    const row = page.getByRole("row", { name: new RegExp(libelle) });
    await row.getByRole("button", { name: /modifier/i }).click();
    const nouveauLibelle = `${libelle} (modifié)`;
    await page.getByLabel(/libellé/i).fill(nouveauLibelle);
    await page.getByRole("button", { name: /^enregistrer$/i }).click();
    await expect(page.getByText(nouveauLibelle)).toBeVisible();

    const updatedRow = page.getByRole("row", { name: new RegExp(nouveauLibelle) });
    await updatedRow.getByRole("button", { name: /supprimer/i }).click();
    await page.getByRole("button", { name: /^supprimer$/i }).click();
    await expect(page.getByText(nouveauLibelle)).toHaveCount(0);
  });
});
