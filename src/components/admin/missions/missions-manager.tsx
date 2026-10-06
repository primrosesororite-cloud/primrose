"use client";

import { SortableList } from "@/components/admin/sortable-list";
import { MissionCard } from "@/components/admin/missions/mission-card";
import { reorderMissions } from "@/actions/admin/missions";
import type { Database } from "@/types/database";

type Mission = Database["public"]["Tables"]["missions"]["Row"];
type Valeur = Database["public"]["Tables"]["valeurs"]["Row"];

export function MissionsManager({
  missions,
  valeurs,
}: {
  missions: Mission[];
  valeurs: Valeur[];
}) {
  return (
    <SortableList
      items={missions}
      getId={(m) => m.id}
      onReorder={reorderMissions}
      renderItem={(mission) => (
        <MissionCard
          mission={mission}
          valeurs={valeurs.filter((v) => v.mission_id === mission.id)}
        />
      )}
    />
  );
}
