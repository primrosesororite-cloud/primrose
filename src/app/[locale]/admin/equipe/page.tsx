import { createClient } from "@/lib/supabase/server";
import { EquipeManager } from "@/components/admin/equipe/equipe-manager";

export default async function AdminEquipePage() {
  const supabase = await createClient();
  const { data: membres } = await supabase
    .from("equipe")
    .select("*")
    .order("ordre", { ascending: true });

  return (
    <div>
      <h1 className="font-serif text-2xl text-primrose-green-dark">Équipe</h1>
      <p className="mt-1 text-sm text-primrose-ink/70">
        Membres affichés sur /a-propos. Glissez-déposez pour réordonner.
      </p>
      <div className="mt-6">
        <EquipeManager membres={membres ?? []} />
      </div>
    </div>
  );
}
