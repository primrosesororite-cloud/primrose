import { createClient } from "@/lib/supabase/server";
import { EvenementsTable } from "@/components/admin/evenements/evenements-table";

export default async function AdminEvenementsPage() {
  const supabase = await createClient();
  const { data: evenements } = await supabase
    .from("evenements")
    .select("*")
    .order("date_evenement", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl text-primrose-green-dark">Événements</h1>
      <p className="mt-1 text-sm text-primrose-ink/70">
        Événements ponctuels de l&apos;association (ateliers, conférences...).
      </p>
      <div className="mt-6">
        <EvenementsTable evenements={evenements ?? []} />
      </div>
    </div>
  );
}
