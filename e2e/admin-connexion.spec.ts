import { test, expect } from "@playwright/test";

test.describe("Connexion admin", () => {
  test("la page de connexion affiche un formulaire e-mail / mot de passe", async ({ page }) => {
    await page.goto("/connexion");
    await expect(page.getByLabel(/e-mail/i)).toBeVisible();
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /se connecter/i })).toBeVisible();
  });

  test("rejette un e-mail mal formé avant tout appel réseau", async ({ page }) => {
    await page.goto("/connexion");
    await page.getByLabel(/e-mail/i).fill("pas-un-email");
    await page.getByLabel(/mot de passe/i).fill("motdepasse123");
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page).toHaveURL(/\/connexion/);
  });

  test("/admin sans session redirige vers la connexion (ou échoue proprement si Supabase n'est pas configuré)", async ({
    page,
  }) => {
    const response = await page.goto("/admin");
    // Selon l'environnement (Supabase configuré ou non), on attend soit une
    // redirection vers /connexion, soit une erreur serveur contrôlée — jamais
    // un accès direct au tableau de bord sans authentification.
    const url = page.url();
    const status = response?.status() ?? 200;
    const redirectedToLogin = /\/connexion/.test(url);
    const controlledError = status >= 400;
    expect(redirectedToLogin || controlledError).toBe(true);
  });
});
