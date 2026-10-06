import { z } from "zod";

export const formationInscriptionSchema = z.object({
  formationId: z.string().uuid(),
  nom: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  telephone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  website: z.string().max(0, "Anti-spam").optional().or(z.literal("")),
  turnstileToken: z.string(),
});

export type FormationInscriptionInput = z.infer<typeof formationInscriptionSchema>;
