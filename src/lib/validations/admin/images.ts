import { z } from "zod";

/**
 * Vrai pour une image envoyée depuis l'admin dans le bucket public du projet.
 * Toute autre adresse est refusée : next/image n'affiche que ce domaine, et
 * une adresse externe arbitraire ne doit jamais être publiée sur le site.
 */
export function estImageDuProjet(url: string) {
  return url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images-public/`);
}

/** Image facultative : chaîne vide acceptée, sinon image du projet. */
export const imageProjetFacultativeSchema = z
  .string()
  .trim()
  .refine((url) => url === "" || estImageDuProjet(url), "Image invalide.");

/** Lien externe : uniquement http(s), jamais javascript: ou data:. */
export const lienExterneSchema = z
  .string()
  .trim()
  .url()
  .refine((url) => /^https?:\/\//i.test(url), "L'adresse doit commencer par https://");
