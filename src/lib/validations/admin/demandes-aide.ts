import { z } from "zod";

export const demandeAideUpdateSchema = z.object({
  statut: z.enum(["nouveau", "en_cours", "traite", "archive"]),
  notesInternes: z.string().trim().max(4000).optional().or(z.literal("")),
  assigneeId: z.string().uuid().optional().or(z.literal("")),
});

export type DemandeAideUpdateInput = z.infer<typeof demandeAideUpdateSchema>;
