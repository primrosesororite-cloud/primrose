import { z } from "zod";
import { lignes } from "@/lib/format";

export const missionEditSchema = z.object({
  titre: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(2000),
  detail: z.string().trim().max(2000).optional().or(z.literal("")),
  /** Une action par ligne (8 maximum, 200 caractères chacune). */
  actions: z
    .string()
    .max(2000)
    .refine(
      (texte) => {
        const liste = lignes(texte);
        return liste.length <= 8 && liste.every((l) => l.length <= 200);
      },
      "8 actions maximum, 200 caractères chacune."
    ),
  icone: z.string().trim().max(60).optional().or(z.literal("")),
});

export const valeurSchema = z.object({
  libelle: z.string().trim().min(1).max(120),
});

export type MissionEditInput = z.infer<typeof missionEditSchema>;
export type ValeurInput = z.infer<typeof valeurSchema>;
