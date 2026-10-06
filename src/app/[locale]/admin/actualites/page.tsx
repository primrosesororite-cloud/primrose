import { createClient } from "@/lib/supabase/server";
import { ActualitesTable } from "@/components/admin/actualites/actualites-table";

export default async function AdminActualitesPage() {
  const supabase = await createClient();
  const { data: actualites } = await supabase
    .from("actualites")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl text-primrose-green-dark">Actualités</h1>
      <p className="mt-1 text-sm text-primrose-ink/70">
        Rédigez, programmez et publiez les articles affichés sur /actualites.
      </p>
      <div className="mt-6">
        <ActualitesTable actualites={actualites ?? []} />
      </div>
    </div>
  );
}
