import { z } from "zod";

export const parametresSchema = z.object({
  nom: z.string().trim().min(1).max(200),
  slogan: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  telephone: z.string().trim().max(40).optional().or(z.literal("")),
  adresse: z.string().trim().max(300).optional().or(z.literal("")),
});

export const numeroUrgenceSchema = z.object({
  label: z.string().trim().min(1).max(80),
  numero: z.string().trim().min(1).max(40),
});

export type ParametresInput = z.infer<typeof parametresSchema>;
export type NumeroUrgenceInput = z.infer<typeof numeroUrgenceSchema>;
