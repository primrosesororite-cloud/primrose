import { z } from "zod";

export const replySchema = z.object({
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
});

export type ReplyInput = z.infer<typeof replySchema>;
