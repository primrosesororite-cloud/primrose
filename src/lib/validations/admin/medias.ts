import { z } from "zod";

export const mediaRecordSchema = z.object({
  url: z.string().trim().url(),
  chemin: z.string().trim().min(1),
  alt: z.string().trim().min(1, "Le texte alternatif est obligatoire.").max(300),
  tailleOctets: z.number().int().min(0).optional(),
});

export const mediaAltSchema = z.object({
  alt: z.string().trim().min(1, "Le texte alternatif est obligatoire.").max(300),
});

export type MediaRecordInput = z.infer<typeof mediaRecordSchema>;
