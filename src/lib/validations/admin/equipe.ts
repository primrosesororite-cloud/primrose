import { z } from "zod";

export const membreEquipeSchema = z.object({
  nom: z.string().trim().min(1).max(120),
  fonction: z.string().trim().max(120).optional().or(z.literal("")),
  bio: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const partenaireSchema = z.object({
  nom: z.string().trim().min(1).max(120),
  lien: z.string().trim().url().optional().or(z.literal("")),
});

export const reseauSocialSchema = z.object({
  plateforme: z.enum(["instagram", "x", "facebook", "youtube", "tiktok", "whatsapp", "linkedin"]),
  url: z.string().trim().url(),
});

export type MembreEquipeInput = z.infer<typeof membreEquipeSchema>;
export type PartenaireInput = z.infer<typeof partenaireSchema>;
export type ReseauSocialInput = z.infer<typeof reseauSocialSchema>;
