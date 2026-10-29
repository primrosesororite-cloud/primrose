/**
 * Aperçu d'un article externe (revue de presse) : titre, description, image,
 * nom du site — comme les aperçus de lien de WhatsApp ou Facebook.
 *
 * Récupéré UNE fois, côté serveur, à l'enregistrement d'une actualité ; les
 * images sont recompressées et copiées dans notre stockage. À l'affichage, le
 * site n'appelle donc jamais le site externe (sécurité stricte, rapidité).
 *
 * Le serveur appelant une adresse saisie dans l'admin, tout est verrouillé :
 * https uniquement, aucune adresse de réseau privé (vérifié à chaque
 * redirection), délai et taille limités, type de contenu contrôlé.
 *
 * Volontairement sans alias « @/ » : le module est aussi utilisable par un
 * script Node (publication assistée).
 */
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import type { ApercuLien } from "../types/database";

const DELAI_MS = 8000;
const MAX_REDIRECTIONS = 3;
const MAX_HTML = 3 * 1024 * 1024;
const MAX_IMAGE = 8 * 1024 * 1024;
const LONGUEUR_DESCRIPTION = 220;
const AGENT = "Mozilla/5.0 (compatible; PrimROSE-apercu/1.0; +https://www.sororiteprimrose.org)";

// ---------------------------------------------------------------------------
// Sécurité réseau
// ---------------------------------------------------------------------------

function ipv4EnNombre(ip: string): number {
  return ip.split(".").reduce((acc, octet) => acc * 256 + Number(octet), 0);
}

const PLAGES_IPV4_INTERDITES: [string, number][] = [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
];

/** Vrai pour toute adresse non routable publiquement (réseau local, boucle, réservée…). */
export function estIpPrivee(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) {
    const n = ipv4EnNombre(ip);
    return PLAGES_IPV4_INTERDITES.some(([base, bits]) => {
      const masque = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
      return ((n & masque) >>> 0) === ((ipv4EnNombre(base) & masque) >>> 0);
    });
  }
  if (version === 6) {
    const a = ip.toLowerCase();
    const mappee = a.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mappee) return estIpPrivee(mappee[1]);
    return (
      a === "::" ||
      a === "::1" ||
      a.startsWith("fc") ||
      a.startsWith("fd") ||
      /^fe[89ab]/.test(a) ||
      a.startsWith("ff")
    );
  }
  return true;
}

/** Refuse tout ce qui n'est pas une adresse https publique standard. */
export async function verifierUrlPublique(brute: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(brute);
  } catch {
    throw new Error("Adresse invalide.");
  }
  if (url.protocol !== "https:") throw new Error("L'adresse doit commencer par https://");
  if (url.username || url.password) throw new Error("Adresse invalide.");
  if (url.port && url.port !== "443") throw new Error("Port non autorisé.");

  const hote = url.hostname.replace(/^\[|\]$/g, "");
  const adresses = isIP(hote) ? [{ address: hote }] : await lookup(hote, { all: true });
  if (adresses.length === 0 || adresses.some(({ address }) => estIpPrivee(address))) {
    throw new Error("Adresse non autorisée.");
  }
  return url;
}

/** Téléchargement borné : redirections revérifiées, délai et taille limités. */
async function telecharger(
  depart: string,
  { maxOctets, typesAcceptes }: { maxOctets: number; typesAcceptes: RegExp }
): Promise<{ octets: Buffer; type: string; urlFinale: URL }> {
  let url = await verifierUrlPublique(depart);
  for (let saut = 0; saut <= MAX_REDIRECTIONS; saut++) {
    const reponse = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(DELAI_MS),
      headers: { "user-agent": AGENT, accept: "text/html,image/*;q=0.9,*/*;q=0.5" },
    });
    if (reponse.status >= 300 && reponse.status < 400) {
      const cible = reponse.headers.get("location");
      if (!cible) throw new Error("Redirection invalide.");
      url = await verifierUrlPublique(new URL(cible, url).toString());
      continue;
    }
    if (!reponse.ok || !reponse.body) throw new Error(`Réponse ${reponse.status}.`);
    const type = reponse.headers.get("content-type") ?? "";
    if (!typesAcceptes.test(type)) throw new Error("Type de contenu non accepté.");
    if (Number(reponse.headers.get("content-length") ?? 0) > maxOctets) throw new Error("Contenu trop volumineux.");

    const morceaux: Uint8Array[] = [];
    let total = 0;
    for await (const morceau of reponse.body as unknown as AsyncIterable<Uint8Array>) {
      total += morceau.byteLength;
      if (total > maxOctets) throw new Error("Contenu trop volumineux.");
      morceaux.push(morceau);
    }
    return { octets: Buffer.concat(morceaux), type, urlFinale: url };
  }
  throw new Error("Trop de redirections.");
}

// ---------------------------------------------------------------------------
// Lecture des métadonnées (pur, testé)
// ---------------------------------------------------------------------------

const ENTITES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…", ndash: "–", mdash: "—",
  laquo: "«", raquo: "»",
};

export function decoderEntites(texte: string): string {
  return texte.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (tout, code: string) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : tout;
    }
    return ENTITES[code.toLowerCase()] ?? tout;
  });
}

function nettoyer(texte: string | undefined | null): string | null {
  if (!texte) return null;
  const propre = decoderEntites(texte).replace(/\s+/g, " ").trim();
  return propre || null;
}

/** Coupe proprement à un mot, avec points de suspension. */
export function tronquer(texte: string, max: number): string {
  if (texte.length <= max) return texte;
  const coupe = texte.slice(0, max);
  return `${coupe.slice(0, Math.max(coupe.lastIndexOf(" "), max * 0.6)).replace(/[\s,;:.–—-]+$/, "")}…`;
}

function attribut(balise: string, nom: string): string | undefined {
  const m = balise.match(new RegExp(`\\b${nom}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? (m[2] ?? m[3]) : undefined;
}

export type MetadonneesPage = {
  titre: string | null;
  description: string | null;
  site: string | null;
  auteur: string | null;
  image: string | null;
  icone: string | null;
};

/** Extrait titre, description, image, site, auteur et icône d'une page HTML. */
export function extraireMetadonnees(html: string, urlPage: string): MetadonneesPage {
  const tete = html.slice(0, 400_000);
  const metas = new Map<string, string>();
  for (const balise of tete.match(/<meta\b[^>]*>/gi) ?? []) {
    const cle = (attribut(balise, "property") ?? attribut(balise, "name"))?.toLowerCase();
    const valeur = attribut(balise, "content");
    if (cle && valeur !== undefined && !metas.has(cle)) metas.set(cle, valeur);
  }
  const absolue = (lien: string | undefined) => {
    if (!lien) return null;
    try {
      const u = new URL(decoderEntites(lien), urlPage);
      return u.protocol === "https:" ? u.toString() : null;
    } catch {
      return null;
    }
  };

  const site = nettoyer(metas.get("og:site_name"));
  let titre = nettoyer(metas.get("og:title") ?? metas.get("twitter:title") ?? tete.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]);
  if (titre && site) {
    // « Titre - NOM DU SITE » : le nom du site est déjà affiché à part.
    const suffixe = new RegExp(`\\s*[-|–—:]\\s*${site.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "i");
    titre = titre.replace(suffixe, "") || titre;
  }
  const description = nettoyer(metas.get("og:description") ?? metas.get("description") ?? metas.get("twitter:description"));

  let auteur = nettoyer(metas.get("author") ?? metas.get("article:author"));
  if (!auteur && metas.get("twitter:label1")?.toLowerCase().includes("crit par")) auteur = nettoyer(metas.get("twitter:data1"));

  const icones = (tete.match(/<link\b[^>]*>/gi) ?? [])
    .filter((b) => /\brel\s*=\s*["'][^"']*\b(icon|apple-touch-icon)\b/i.test(b))
    .map((b) => ({ href: attribut(b, "href"), taille: parseInt(attribut(b, "sizes") ?? "0", 10) || 0 }))
    .sort((a, b) => Math.abs(a.taille - 128) - Math.abs(b.taille - 128));

  return {
    titre,
    description: description ? tronquer(description, LONGUEUR_DESCRIPTION) : null,
    site,
    auteur,
    image: absolue(metas.get("og:image:secure_url") ?? metas.get("og:image") ?? metas.get("twitter:image")),
    icone: absolue(icones[0]?.href) ?? absolue("/favicon.ico"),
  };
}

// ---------------------------------------------------------------------------
// Génération complète
// ---------------------------------------------------------------------------

/** Accès minimal au bucket d'images (client Supabase de l'admin ou d'un script). */
export type StockageImages = {
  upload: (
    chemin: string,
    donnees: Buffer,
    options: { contentType: string; cacheControl?: string }
  ) => Promise<{ error: { message: string } | null }>;
  getPublicUrl: (chemin: string) => { data: { publicUrl: string } };
};

async function copierImage(
  stockage: StockageImages,
  source: string,
  largeur: number
): Promise<string | null> {
  try {
    const { octets } = await telecharger(source, { maxOctets: MAX_IMAGE, typesAcceptes: /^image\// });
    const webp = await sharp(octets, { limitInputPixels: 40_000_000 })
      .rotate()
      .resize({ width: largeur, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    const chemin = `apercus/${randomUUID()}.webp`;
    const { error } = await stockage.upload(chemin, webp, { contentType: "image/webp", cacheControl: "31536000" });
    if (error) return null;
    return stockage.getPublicUrl(chemin).data.publicUrl;
  } catch {
    // Image indisponible ou invalide : l'aperçu reste utilisable sans elle.
    return null;
  }
}

/** Récupère l'aperçu d'un article externe et copie ses images dans notre stockage. */
export async function genererApercu(adresse: string, stockage: StockageImages): Promise<ApercuLien> {
  const { octets, urlFinale } = await telecharger(adresse, {
    maxOctets: MAX_HTML,
    typesAcceptes: /^(text\/html|application\/xhtml\+xml)/,
  });
  const meta = extraireMetadonnees(octets.toString("utf8"), urlFinale.toString());
  const [image_url, icone_url] = await Promise.all([
    meta.image ? copierImage(stockage, meta.image, 1200) : null,
    meta.icone ? copierImage(stockage, meta.icone, 96) : null,
  ]);

  return {
    url: adresse,
    domaine: new URL(adresse).hostname.replace(/^www\./, ""),
    site: meta.site,
    titre: meta.titre,
    description: meta.description,
    auteur: meta.auteur,
    image_url,
    icone_url,
    recupere_le: new Date().toISOString(),
  };
}
