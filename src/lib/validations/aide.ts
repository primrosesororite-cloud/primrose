import { z } from "zod";

export const aideSchema = z.object({
  moyenContact: z.enum(["telephone", "whatsapp", "email"]),
  coordonnee: z.string().trim().min(3).max(255),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  urgence: z.enum(["normal", "important", "urgent"]),
  nePasRecontacterAvant: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  website: z.string().max(0, "Anti-spam").optional().or(z.literal("")),
  turnstileToken: z.string(),
});

export type AideInput = z.infer<typeof aideSchema>;
