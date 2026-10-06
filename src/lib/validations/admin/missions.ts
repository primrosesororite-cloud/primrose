import { z } from "zod";

export const missionEditSchema = z.object({
  titre: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(2000),
  icone: z.string().trim().max(60).optional().or(z.literal("")),
});

export const valeurSchema = z.object({
  libelle: z.string().trim().min(1).max(120),
});

export type MissionEditInput = z.infer<typeof missionEditSchema>;
export type ValeurInput = z.infer<typeof valeurSchema>;
