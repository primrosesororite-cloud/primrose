"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { SortableList } from "@/components/admin/sortable-list";
import { ValeurRow } from "@/components/admin/missions/valeur-row";
import {
  missionEditSchema,
  type MissionEditInput,
} from "@/lib/validations/admin/missions";
import {
  updateMission,
  toggleMissionActif,
  createValeur,
  reorderValeurs,
} from "@/actions/admin/missions";
import type { Database } from "@/types/database";

type Mission = Database["public"]["Tables"]["missions"]["Row"];
type Valeur = Database["public"]["Tables"]["valeurs"]["Row"];

export function MissionCard({
  mission,
  valeurs,
}: {
  mission: Mission;
  valeurs: Valeur[];
}) {
  const [newValeur, setNewValeur] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<MissionEditInput>({
    resolver: zodResolver(missionEditSchema),
    defaultValues: {
      titre: mission.titre,
      description: mission.description,
      icone: mission.icone ?? "",
    },
  });

  async function onSubmit(values: MissionEditInput) {
    const fd = new FormData();
    fd.set("titre", values.titre);
    fd.set("description", values.description);
    fd.set("icone", values.icone ?? "");
    const result = await updateMission(mission.id, fd);
    if (result?.error) toast.error(result.error);
    else toast.success("Mission mise à jour.");
  }

  async function handleAddValeur() {
    if (!newValeur.trim()) return;
    const fd = new FormData();
    fd.set("libelle", newValeur.trim());
    const result = await createValeur(mission.id, valeurs.length + 1, fd);
    if (result?.error) toast.error(result.error);
    else setNewValeur("");
  }

  return (
    <div className="rounded-card bg-primrose-white p-6 shadow-card">
      <div className="flex items-start gap-3">
        <form onSubmit={handleSubmit(onSubmit)} className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <input
              className="min-w-0 flex-1 rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm font-medium"
              {...register("titre")}
            />
            <ToggleSwitch checked={mission.actif} onToggle={(next) => toggleMissionActif(mission.id, next)} />
          </div>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
            {...register("description")}
          />
          <div className="flex items-center gap-3">
            <input
              placeholder="Icône (lucide, ex. megaphone)"
              className="w-56 rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
              {...register("icone")}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-primrose-green-dark px-4 py-2 text-sm font-medium text-primrose-white hover:bg-primrose-green-dark/90 disabled:opacity-60"
            >
              {isSubmitting ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-4 border-t border-primrose-ink/10 pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-primrose-ink/70">
          Nos valeurs
        </p>
        <div className="mt-2">
          <SortableList
            items={valeurs}
            getId={(v) => v.id}
            onReorder={reorderValeurs}
            renderItem={(v) => <ValeurRow valeur={v} />}
          />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            value={newValeur}
            onChange={(e) => setNewValeur(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddValeur())}
            placeholder="Ajouter une valeur…"
            className="rounded-full border border-primrose-ink/15 px-3 py-1.5 text-xs"
          />
          <button
            type="button"
            onClick={handleAddValeur}
            aria-label="Ajouter"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-primrose-green-dark text-primrose-white"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
