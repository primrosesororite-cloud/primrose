import { test, expect } from "@playwright/test";

test.describe("Navigation publique", () => {
  test("la page d'accueil charge avec le titre principal", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Un monde sans violences de genre"
    );
  });

  test("le bouton Quitter rapidement est toujours présent", async ({ page }) => {
    await page.goto("/");
    // Le nom accessible du bouton vient de son aria-label (description
    // complète), pas du texte visible "Quitter rapidement" — l'aria-label
    // prime toujours sur le texte visible pour le nom accessible.
    await expect(
      page.getByRole("button", { name: /quitter immédiatement ce site/i })
    ).toBeVisible();
  });

  test("double Échap redirige vers un site neutre", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await page.waitForURL(/weather\.com/, { timeout: 15000, waitUntil: "commit" });
  });

  test("la navbar permet d'atteindre les pages principales", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "À propos", exact: true }).first().click();
    await expect(page).toHaveURL(/\/a-propos/);
  });

  test("le lien Contact – Besoin d'aide mène à la page d'aide", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Contact.*Besoin d'aide/i }).first().click();
    await expect(page).toHaveURL(/\/besoin-d-aide/);
  });

  test("404 sur une route inexistante", async ({ page }) => {
    await page.goto("/cette-page-n-existe-pas");
    await expect(page.getByText(/page introuvable/i)).toBeVisible();
  });
});
