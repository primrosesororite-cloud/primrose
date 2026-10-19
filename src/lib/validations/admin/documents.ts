import { z } from "zod";

export const DOCUMENT_CATEGORIES = [
  "rapport",
  "guide",
  "plaidoyer",
  "formation",
  "juridique",
  "autre",
] as const;

/** Limite alignée sur le `file_size_limit` du bucket documents-public. */
export const DOCUMENT_MAX_OCTETS = 20 * 1024 * 1024;

/** Chemin Storage généré côté client : documents/<uuid>.pdf, rien d'autre. */
export const DOCUMENT_CHEMIN_REGEX = /^documents\/[0-9a-f-]{36}\.pdf$/;

export const documentSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Le slug est requis.")
    .max(160)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug invalide (minuscules, chiffres, tirets)"),
  titre: z.string().trim().min(1, "Le titre est requis.").max(200),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  categorie: z.enum(DOCUMENT_CATEGORIES),
  date_publication: z.string().optional().or(z.literal("")),
  publie: z.boolean(),
});

export const documentFichierSchema = z.object({
  chemin: z.string().regex(DOCUMENT_CHEMIN_REGEX, "Fichier invalide."),
  tailleOctets: z.number().int().min(1).max(DOCUMENT_MAX_OCTETS, "Fichier trop volumineux (20 Mo max)."),
});

export type DocumentInput = z.infer<typeof documentSchema>;
