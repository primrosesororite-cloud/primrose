import { describe, expect, it } from "vitest";
import { decoderEntites, estIpPrivee, extraireMetadonnees, tronquer, verifierUrlPublique } from "./apercu-lien";

describe("estIpPrivee", () => {
  it.each(["127.0.0.1", "10.2.3.4", "172.16.0.1", "172.31.255.255", "192.168.1.10", "169.254.169.254", "100.64.0.1", "0.0.0.0", "::1", "fd00::1", "fe80::1", "::ffff:127.0.0.1"])(
    "refuse %s",
    (ip) => expect(estIpPrivee(ip)).toBe(true)
  );

  it.each(["8.8.8.8", "172.32.0.1", "104.21.3.4", "2606:4700::1111"])("accepte %s", (ip) =>
    expect(estIpPrivee(ip)).toBe(false)
  );
});

describe("verifierUrlPublique", () => {
  it("refuse http, les identifiants, les ports exotiques et les IP privées", async () => {
    await expect(verifierUrlPublique("http://exemple.org")).rejects.toThrow();
    await expect(verifierUrlPublique("https://user:pass@exemple.org")).rejects.toThrow();
    await expect(verifierUrlPublique("https://exemple.org:8443/")).rejects.toThrow();
    await expect(verifierUrlPublique("https://127.0.0.1/")).rejects.toThrow();
    await expect(verifierUrlPublique("https://[::1]/")).rejects.toThrow();
    await expect(verifierUrlPublique("pas une adresse")).rejects.toThrow();
  });
});

describe("extraireMetadonnees", () => {
  const html = `<!doctype html><html><head>
    <title>Titre de secours</title>
    <meta property="og:site_name" content="LACONGOLAISE 242" />
    <meta property="og:title" content="L&rsquo;ASSOCIATION PRIMROSE DÉVOILE LA BRAZZA BALADE - LACONGOLAISE 242" />
    <meta property="og:description" content="Une marche sportive &amp; solidaire. ${"Texte long ".repeat(40)}" />
    <meta property="og:image" content="/wp-content/uploads/prm.jpg" />
    <meta name="twitter:label1" content="Écrit par" />
    <meta name="twitter:data1" content="VITIA KOUTIA" />
    <link rel="icon" href="/icone-32.jpg" sizes="32x32" />
    <link rel="icon" href="/icone-192.jpg" sizes="192x192" />
  </head><body></body></html>`;
  const meta = extraireMetadonnees(html, "https://lacongolaise242.org/article/");

  it("lit titre, site et auteur, et retire le nom du site du titre", () => {
    expect(meta.titre).toBe("L’ASSOCIATION PRIMROSE DÉVOILE LA BRAZZA BALADE");
    expect(meta.site).toBe("LACONGOLAISE 242");
    expect(meta.auteur).toBe("VITIA KOUTIA");
  });

  it("décode et raccourcit la description", () => {
    expect(meta.description?.startsWith("Une marche sportive & solidaire.")).toBe(true);
    expect(meta.description?.endsWith("…")).toBe(true);
    expect(meta.description!.length).toBeLessThanOrEqual(221);
  });

  it("résout les adresses relatives et choisit l'icône la plus nette", () => {
    expect(meta.image).toBe("https://lacongolaise242.org/wp-content/uploads/prm.jpg");
    expect(meta.icone).toBe("https://lacongolaise242.org/icone-192.jpg");
  });

  it("se rabat sur <title> sans balises Open Graph", () => {
    expect(extraireMetadonnees("<title>Simple</title>", "https://a.org/").titre).toBe("Simple");
  });

  it("ignore une image en http (contenu mixte)", () => {
    const m = extraireMetadonnees('<meta property="og:image" content="http://a.org/x.jpg">', "https://a.org/");
    expect(m.image).toBeNull();
  });
});

describe("decoderEntites / tronquer", () => {
  it("décode les entités nommées et numériques", () => {
    expect(decoderEntites("C&rsquo;est &#233;t&#xE9; &laquo;ok&raquo;")).toBe("C’est été «ok»");
  });

  it("coupe à un mot entier", () => {
    expect(tronquer("un deux trois quatre", 12)).toBe("un deux…");
    expect(tronquer("court", 12)).toBe("court");
  });
});
