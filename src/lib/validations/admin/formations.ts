import { z } from "zod";

export const formationSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug invalide (minuscules, chiffres, tirets)"),
  titre: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  public_cible: z.string().trim().max(120).optional().or(z.literal("")),
  date_debut: z.string().optional().or(z.literal("")),
  lieu: z.string().trim().max(200).optional().or(z.literal("")),
  places: z.number().int().min(0).optional(),
  statut: z.enum(["brouillon", "ouverte", "complete", "terminee"]),
});

export type FormationInput = z.infer<typeof formationSchema>;
