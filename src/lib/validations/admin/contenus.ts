import { z } from "zod";

export const visionSchema = z.object({
  titre: z.string().trim().min(1).max(200),
  texte: z.string().trim().min(1).max(2000),
});

export const chiffreCleSchema = z.object({
  libelle: z.string().trim().min(1).max(120),
  valeur: z.number().int().min(0),
  suffixe: z.string().trim().max(10).optional().or(z.literal("")),
  ordre: z.number().int().min(0),
});

export type VisionInput = z.infer<typeof visionSchema>;
export type ChiffreCleInput = z.infer<typeof chiffreCleSchema>;
