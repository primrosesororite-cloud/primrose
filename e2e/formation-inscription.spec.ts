import { test, expect } from "@playwright/test";

test.describe("Parcours formations", () => {
  test("la liste des formations affiche un état vide ou des cartes", async ({ page }) => {
    await page.goto("/formations");
    await expect(page.getByRole("heading", { name: /nos formations/i })).toBeVisible();

    const cards = page.locator("a[href^='/formations/']");
    const count = await cards.count();

    if (count === 0) {
      // Aucun projet Supabase de test connecté ici : on vérifie l'état vide plutôt que d'échouer.
      await expect(page.getByText(/aucune formation/i)).toBeVisible();
    } else {
      await cards.first().click();
      await expect(
        page.getByRole("heading", { name: /s.inscrire à cette formation/i })
      ).toBeVisible();

      await page.getByLabel(/nom complet/i).fill("Awa Nzila");
      await page.getByLabel(/adresse e-mail/i).fill("awa@example.com");
      // On ne soumet pas réellement (nécessite Turnstile + Supabase configurés) :
      // ce test vérifie seulement que le formulaire est utilisable.
      await expect(
        page.getByRole("button", { name: /envoyer ma demande d.inscription/i })
      ).toBeEnabled();
    }
  });

  test("une formation inexistante affiche un message clair (pas un plantage)", async ({ page }) => {
    const response = await page.goto("/formations/slug-qui-n-existe-pas");
    expect(response?.status()).toBeLessThan(500);
    await expect(page.getByText(/page introuvable/i)).toBeVisible();
  });
});
