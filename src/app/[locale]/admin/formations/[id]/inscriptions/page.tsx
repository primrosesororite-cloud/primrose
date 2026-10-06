import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { InscriptionsTable } from "@/components/admin/formations/inscriptions-table";

export default async function AdminInscriptionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: formation } = await supabase
  .from("formations")
  .select("id, titre")
  .eq("id", id)
  .single();

  if (!formation) notFound();

  const { data: inscriptions } = await supabase
  .from("formation_inscriptions")
  .select("*")
  .eq("formation_id", id)
  .order("created_at", { ascending: false });

  return (
  <div>
  <Link href="/admin/formations" className="text-sm text-primrose-green-dark hover:underline">
  ← Retour aux formations
  </Link>
  <h1 className="mt-2 font-serif text-2xl text-primrose-green-dark">
  Inscriptions — {formation.titre}
  </h1>
  <div className="mt-6">
  <InscriptionsTable
  inscriptions={inscriptions ?? []}
  formationTitre={formation.titre}
  />
  </div>
  </div>
  );
}
