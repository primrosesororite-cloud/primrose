/** Taille de fichier lisible (« 2,4 Mo »), unités françaises octet/Ko/Mo. */
export function formatTaille(octets: number, locale = "fr"): string {
  const unites = locale.startsWith("fr") ? ["o", "Ko", "Mo", "Go"] : ["B", "KB", "MB", "GB"];
  let valeur = octets;
  let index = 0;
  while (valeur >= 1024 && index < unites.length - 1) {
    valeur /= 1024;
    index++;
  }
  const nombre = new Intl.NumberFormat(locale, {
    maximumFractionDigits: index === 0 || valeur >= 10 ? 0 : 1,
  }).format(valeur);
  return `${nombre} ${unites[index]}`;
}

/** Slug URL à partir d'un titre : sans accents, minuscules, tirets. */
export function slugify(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160)
    .replace(/-+$/, "");
}

/** Texte saisi « une entrée par ligne » vers une liste (lignes vides ignorées). */
export function lignes(texte: string): string[] {
  return texte
    .split(/\r?\n/)
    .map((ligne) => ligne.trim())
    .filter(Boolean);
}
