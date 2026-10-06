import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = [
  "/",
  "/a-propos",
  "/notre-mission",
  "/formations",
  "/evenements",
  "/actualites",
  "/rejoindre",
  "/contact",
  "/besoin-d-aide",
  "/mentions-legales",
  "/politique-de-confidentialite",
];

test.describe("Accessibilité (axe-core, WCAG 2 AA)", () => {
  for (const path of PAGES) {
    test(`${path} ne présente aucune violation critique/sérieuse`, async ({ page }, testInfo) => {
      // Neutralise les animations d'entrée (navbar, etc.) avant le scan : sans
      // cela, axe peut lire les couleurs en pleine transition d'opacité et
      // signaler un contraste insuffisant qui n'existe qu'à l'état stable.
      // Ceci exerce aussi le chemin prefers-reduced-motion du site.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const blocking = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      // Détail joint au rapport Playwright (pas de console.log) pour diagnostiquer
      // une violation sans avoir à relire tout le payload axe.
      await testInfo.attach("axe-violations", {
        body: JSON.stringify(
          blocking.map((v) => ({ id: v.id, help: v.help, nodes: v.nodes.length })),
          null,
          2
        ),
        contentType: "application/json",
      });

      expect(blocking).toEqual([]);
    });
  }

  test("navigation au clavier : le focus est visible sur les liens de la navbar", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });
});
