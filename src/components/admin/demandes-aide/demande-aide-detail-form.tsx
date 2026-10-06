"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  demandeAideUpdateSchema,
  type DemandeAideUpdateInput,
} from "@/lib/validations/admin/demandes-aide";
import { updateDemandeAide } from "@/actions/admin/demandes-aide";
import type { Database, RequestStatus } from "@/types/database";

type Demande = Database["public"]["Tables"]["demandes_aide"]["Row"];
type Staff = { id: string; full_name: string };

const STATUTS: RequestStatus[] = ["nouveau", "en_cours", "traite", "archive"];
const STATUT_LABELS: Record<RequestStatus, string> = {
  nouveau: "Nouveau",
  en_cours: "En cours",
  traite: "Traité",
  archive: "Archivé",
};

const MOYEN_LABELS: Record<Demande["moyen_contact"], string> = {
  telephone: "Téléphone",
  whatsapp: "WhatsApp",
  email: "E-mail",
};

const URGENCE_LABELS: Record<Demande["urgence"], string> = {
  normal: "Normal",
  important: "Important",
  urgent: "Urgent",
};

export function DemandeAideDetailForm({
  demande,
  coordonnee,
  message,
  staff,
}: {
  demande: Demande;
  coordonnee: string;
  message: string | null;
  staff: Staff[];
}) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
  } = useForm<DemandeAideUpdateInput>({
    resolver: zodResolver(demandeAideUpdateSchema),
    defaultValues: {
      statut: demande.statut,
      notesInternes: demande.notes_internes ?? "",
      assigneeId: demande.assignee_id ?? "",
    },
  });

  function onSubmit(values: DemandeAideUpdateInput) {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("statut", values.statut);
      fd.set("notesInternes", values.notesInternes ?? "");
      fd.set("assigneeId", values.assigneeId ?? "");
      const result = await updateDemandeAide(demande.id, fd);
      if (result?.error) toast.error(result.error);
      else toast.success("Demande mise à jour.");
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-card bg-primrose-white p-6 shadow-card">
        <p className="text-xs font-medium uppercase tracking-wide text-primrose-ink/70">
          Contenu (déchiffré à l&apos;instant, réservé à cette consultation)
        </p>
        <dl className="mt-3 space-y-3 text-sm">
          <div>
            <dt className="text-xs text-primrose-ink/70">Moyen de contact</dt>
            <dd>{MOYEN_LABELS[demande.moyen_contact]}</dd>
          </div>
          <div>
            <dt className="text-xs text-primrose-ink/70">Coordonnée</dt>
            <dd className="font-medium">{coordonnee}</dd>
          </div>
          <div>
            <dt className="text-xs text-primrose-ink/70">Urgence</dt>
            <dd>{URGENCE_LABELS[demande.urgence]}</dd>
          </div>
          {demande.ne_pas_recontacter_avant && (
            <div>
              <dt className="text-xs text-primrose-ink/70">Ne pas recontacter avant</dt>
              <dd>{new Date(demande.ne_pas_recontacter_avant).toLocaleDateString("fr-FR")}</dd>
            </div>
          )}
          {message && (
            <div>
              <dt className="text-xs text-primrose-ink/70">Message</dt>
              <dd className="whitespace-pre-wrap">{message}</dd>
            </div>
          )}
        </dl>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-card bg-primrose-white p-6 shadow-card"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-primrose-ink/70">
          Suivi (équipe uniquement)
        </p>

        <div>
          <label className="text-sm font-medium text-primrose-ink">Statut</label>
          <select
            className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
            {...register("statut")}
          >
            {STATUTS.map((s) => (
              <option key={s} value={s}>
                {STATUT_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-primrose-ink">Assignée à</label>
          <select
            className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
            {...register("assigneeId")}
          >
            <option value="">Non assignée</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-primrose-ink">Notes internes</label>
          <textarea
            rows={6}
            className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
            {...register("notesInternes")}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-primrose-green-dark px-5 py-2.5 text-sm font-medium text-primrose-white hover:bg-primrose-green-dark/90 disabled:opacity-60"
        >
          {isPending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
