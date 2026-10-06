import { requireAdmin } from "@/lib/admin/current-admin";
import { createClient } from "@/lib/supabase/server";
import { DemandesAideTable } from "@/components/admin/demandes-aide/demandes-aide-table";

export default async function AdminDemandesAidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireAdmin(locale);

  const supabase = await createClient();
  // Volontairement aucune sélection de `coordonnee`/`message` ici : la liste
  // reste sur les métadonnées, le contenu chiffré n'est déchiffré (et donc
  // journalisé) qu'à l'ouverture d'une demande précise.
  const { data: demandes } = await supabase
    .from("demandes_aide")
    .select("id, moyen_contact, urgence, statut, assignee_id, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl text-primrose-green-dark">
        Demandes d&apos;aide
      </h1>
      <p className="mt-1 text-sm text-primrose-ink/70">
        Accès réservé admin/super_admin. Chaque consultation d&apos;une demande
        est journalisée.
      </p>
      <div className="mt-6">
        <DemandesAideTable demandes={demandes ?? []} />
      </div>
    </div>
  );
}
