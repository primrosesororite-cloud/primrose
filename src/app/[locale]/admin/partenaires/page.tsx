import { createClient } from "@/lib/supabase/server";
import { PartenairesManager } from "@/components/admin/partenaires/partenaires-manager";

export default async function AdminPartenairesPage() {
  const supabase = await createClient();
  const { data: partenaires } = await supabase
    .from("partenaires")
    .select("*")
    .order("ordre", { ascending: true });

  return (
    <div>
      <h1 className="font-serif text-2xl text-primrose-green-dark">Partenaires</h1>
      <p className="mt-1 text-sm text-primrose-ink/70">
        Logos affichés sur /a-propos. Glissez-déposez pour réordonner.
      </p>
      <div className="mt-6">
        <PartenairesManager partenaires={partenaires ?? []} />
      </div>
    </div>
  );
}
