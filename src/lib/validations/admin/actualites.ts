import { z } from "zod";

export const actualiteSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug invalide (minuscules, chiffres, tirets)"),
  titre: z.string().trim().min(1).max(200),
  resume: z.string().trim().max(500).optional().or(z.literal("")),
  image_url: z.string().trim().url().optional().or(z.literal("")),
  publie: z.boolean(),
  date_publication: z.string().optional().or(z.literal("")),
});

export const evenementSchema = z.object({
  titre: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  date_evenement: z.string().min(1, "Date requise"),
  lieu: z.string().trim().max(200).optional().or(z.literal("")),
  image_url: z.string().trim().url().optional().or(z.literal("")),
  publie: z.boolean(),
});

export type ActualiteInput = z.infer<typeof actualiteSchema>;
export type EvenementInput = z.infer<typeof evenementSchema>;
