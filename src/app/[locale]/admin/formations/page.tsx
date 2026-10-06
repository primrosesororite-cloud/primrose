import { createClient } from "@/lib/supabase/server";
import { FormationsTable } from "@/components/admin/formations/formations-table";

export default async function AdminFormationsPage() {
  const supabase = await createClient();
  const { data: formations } = await supabase
    .from("formations")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl text-primrose-green-dark">Formations</h1>
      <p className="mt-1 text-sm text-primrose-ink/70">
        Gérez les sessions de formation publiées sur /formations.
      </p>
      <div className="mt-6">
        <FormationsTable formations={formations ?? []} />
      </div>
    </div>
  );
}
