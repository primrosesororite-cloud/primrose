import { createClient } from "@/lib/supabase/server";
import { ReseauxTable } from "@/components/admin/reseaux-sociaux/reseaux-table";

export default async function AdminReseauxSociauxPage() {
  const supabase = await createClient();
  const { data: reseaux } = await supabase.from("reseaux_sociaux").select("*");

  return (
    <div>
      <h1 className="font-serif text-2xl text-primrose-green-dark">Réseaux sociaux</h1>
      <p className="mt-1 text-sm text-primrose-ink/70">
        Liens affichés dans le pied de page du site public.
      </p>
      <div className="mt-6">
        <ReseauxTable reseaux={reseaux ?? []} />
      </div>
    </div>
  );
}
