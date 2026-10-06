import { z } from "zod";

export const contactSchema = z.object({
  nom: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  telephone: z.string().trim().max(40).optional().or(z.literal("")),
  sujet: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(4000),
  website: z.string().max(0, "Anti-spam").optional().or(z.literal("")),
  turnstileToken: z.string(),
});

export type ContactInput = z.infer<typeof contactSchema>;
