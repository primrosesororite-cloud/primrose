import { createClient } from "@/lib/supabase/server";
import { MissionsManager } from "@/components/admin/missions/missions-manager";

export default async function AdminMissionsPage() {
  const supabase = await createClient();
  const [{ data: missions }, { data: valeurs }] = await Promise.all([
    supabase.from("missions").select("*").order("ordre", { ascending: true }),
    supabase.from("valeurs").select("*").order("ordre", { ascending: true }),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl text-primrose-green-dark">
        Missions & valeurs
      </h1>
      <p className="mt-1 text-sm text-primrose-ink/70">
        Glissez-déposez pour réordonner. Les 4 axes (Prévenir, Soutenir, Plaider,
        Former) sont fixes : titre, description et valeurs sont modifiables, mais
        aucun axe ne peut être créé ou supprimé ici.
      </p>
      <p className="mt-1 text-xs text-primrose-alert/80">
        Le site public affiche actuellement ces textes depuis les fichiers de
        traduction, pas depuis cette table : une mise à jour ici ne se reflète
        pas encore automatiquement sur /notre-mission.
      </p>

      <div className="mt-6">
        <MissionsManager missions={missions ?? []} valeurs={valeurs ?? []} />
      </div>
    </div>
  );
}
