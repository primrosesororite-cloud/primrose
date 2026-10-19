import { z } from "zod";
import { lignes } from "@/lib/format";

export const visionSchema = z.object({
  titre: z.string().trim().min(1).max(200),
  texte: z.string().trim().min(1).max(2000),
  /** Une valeur par ligne (10 maximum, 80 caractères chacune). */
  valeurs: z
    .string()
    .max(1000)
    .refine(
      (texte) => {
        const liste = lignes(texte);
        return liste.length <= 10 && liste.every((l) => l.length <= 80);
      },
      "10 valeurs maximum, 80 caractères chacune."
    ),
});

export const chiffreCleSchema = z.object({
  libelle: z.string().trim().min(1).max(120),
  valeur: z.number().int().min(0),
  suffixe: z.string().trim().max(10).optional().or(z.literal("")),
  ordre: z.number().int().min(0),
});

export type VisionInput = z.infer<typeof visionSchema>;
export type ChiffreCleInput = z.infer<typeof chiffreCleSchema>;
