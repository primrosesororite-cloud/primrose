import { z } from "zod";

export const adhesionSchema = z.object({
  type: z.enum(["membre", "benevole", "partenaire", "donateur"]),
  nom: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  telephone: z.string().trim().max(40).optional().or(z.literal("")),
  ville: z.string().trim().max(120).optional().or(z.literal("")),
  motivation: z.string().trim().max(3000).optional().or(z.literal("")),
  website: z.string().max(0, "Anti-spam").optional().or(z.literal("")),
  turnstileToken: z.string(),
});

export type AdhesionInput = z.infer<typeof adhesionSchema>;
