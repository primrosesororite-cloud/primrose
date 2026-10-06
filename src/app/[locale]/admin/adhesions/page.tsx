import { requireAdmin } from "@/lib/admin/current-admin";
import { createClient } from "@/lib/supabase/server";
import { AdhesionsTable } from "@/components/admin/demandes/adhesions-table";

export default async function AdminAdhesionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireAdmin(locale);

  const supabase = await createClient();
  const { data: adhesions } = await supabase
    .from("membres_demandes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl text-primrose-green-dark">
        Demandes d&apos;adhésion
      </h1>
      <p className="mt-1 text-sm text-primrose-ink/70">
        Membres, bénévoles, partenaires et donateurs ayant rempli le formulaire /rejoindre.
      </p>
      <div className="mt-6">
        <AdhesionsTable adhesions={adhesions ?? []} />
      </div>
    </div>
  );
}
