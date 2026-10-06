"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { Modal } from "@/components/admin/modal";
import { replySchema, type ReplyInput } from "@/lib/validations/admin/demandes";
import { replyToEmail } from "@/actions/admin/demandes";

export function ReplyButton({ to, defaultSubject }: { to: string; defaultSubject: string }) {
  const [open, setOpen] = useState(false);
  const {
  register,
  handleSubmit,
  reset,
  formState: { isSubmitting },
  } = useForm<ReplyInput>({
  resolver: zodResolver(replySchema),
  defaultValues: { subject: defaultSubject, message: "" },
  });

  async function onSubmit(values: ReplyInput) {
  const fd = new FormData();
  fd.set("subject", values.subject);
  fd.set("message", values.message);
  const result = await replyToEmail(to, fd);
  if (result?.error) toast.error(result.error);
  else {
  toast.success("Réponse envoyée.");
  reset();
  setOpen(false);
  }
  }

  return (
  <>
  <button
  type="button"
  onClick={() => setOpen(true)}
  aria-label={`Répondre à ${to}`}
  className="flex h-8 w-8 items-center justify-center rounded-full text-primrose-ink/60 hover:bg-primrose-cream hover:text-primrose-ink"
  >
  <Mail className="h-4 w-4" aria-hidden />
  </button>

  <Modal open={open} onOpenChange={setOpen} title={`Répondre à ${to}`}>
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  <div>
  <label className="text-sm font-medium text-primrose-ink">Sujet</label>
  <input
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("subject")}
  />
  </div>
  <div>
  <label className="text-sm font-medium text-primrose-ink">Message</label>
  <textarea
  rows={6}
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("message")}
  />
  </div>
  <button
  type="submit"
  disabled={isSubmitting}
  className="rounded-full bg-primrose-green-dark px-5 py-2.5 text-sm font-medium text-primrose-white hover:bg-primrose-green-dark/90 disabled:opacity-60"
  >
  {isSubmitting ? "Envoi…" : "Envoyer la réponse"}
  </button>
  </form>
  </Modal>
  </>
  );
}
