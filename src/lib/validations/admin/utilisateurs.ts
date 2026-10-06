import { z } from "zod";

export const inviteSchema = z.object({
  email: z.string().trim().email(),
  fullName: z.string().trim().min(1).max(120),
});

export type InviteInput = z.infer<typeof inviteSchema>;
