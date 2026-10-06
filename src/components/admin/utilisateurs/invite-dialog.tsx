"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Modal } from "@/components/admin/modal";
import { inviteSchema, type InviteInput } from "@/lib/validations/admin/utilisateurs";
import { inviteUtilisateur } from "@/actions/admin/utilisateurs";

export function InviteDialog({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const {
  register,
  handleSubmit,
  reset,
  formState: { isSubmitting, errors },
  } = useForm<InviteInput>({
  resolver: zodResolver(inviteSchema),
  defaultValues: { email: "", fullName: "" },
  });

  async function onSubmit(values: InviteInput) {
  const fd = new FormData();
  fd.set("email", values.email);
  fd.set("fullName", values.fullName);
  const result = await inviteUtilisateur(locale, fd);
  if (result?.error) toast.error(result.error);
  else {
  toast.success("Invitation envoyée.");
  reset();
  setOpen(false);
  }
  }

  return (
  <>
  <button
  type="button"
  onClick={() => setOpen(true)}
  className="inline-flex items-center gap-1.5 rounded-full bg-primrose-green-dark px-4 py-2 text-sm font-medium text-primrose-white hover:bg-primrose-green-dark/90"
  >
  <UserPlus className="h-4 w-4" aria-hidden />
  Inviter
  </button>

  <Modal open={open} onOpenChange={setOpen} title="Inviter un administrateur">
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  <div>
  <label className="text-sm font-medium text-primrose-ink">Nom complet</label>
  <input
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("fullName")}
  />
  {errors.fullName && <p className="mt-1 text-xs text-primrose-alert">Requis.</p>}
  </div>
  <div>
  <label className="text-sm font-medium text-primrose-ink">E-mail</label>
  <input
  type="email"
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("email")}
  />
  {errors.email && (
  <p className="mt-1 text-xs text-primrose-alert">Adresse invalide.</p>
  )}
  </div>
  <p className="text-xs text-primrose-ink/70">
  La personne reçoit un e-mail pour définir son mot de passe. Son
  rôle par défaut est « editor » — modifiable ensuite dans la liste.
  </p>
  <button
  type="submit"
  disabled={isSubmitting}
  className="rounded-full bg-primrose-green-dark px-5 py-2.5 text-sm font-medium text-primrose-white hover:bg-primrose-green-dark/90 disabled:opacity-60"
  >
  {isSubmitting ? "Envoi…" : "Envoyer l'invitation"}
  </button>
  </form>
  </Modal>
  </>
  );
}
