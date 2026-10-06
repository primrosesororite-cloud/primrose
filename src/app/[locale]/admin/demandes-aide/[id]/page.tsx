import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/current-admin";
import { createClient } from "@/lib/supabase/server";
import { decryptField } from "@/lib/crypto";
import { Link } from "@/i18n/navigation";
import { DemandeAideDetailForm } from "@/components/admin/demandes-aide/demande-aide-detail-form";

export default async function AdminDemandeAideDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const { user } = await requireAdmin(locale);

  const supabase = await createClient();
  const { data: demande } = await supabase
  .from("demandes_aide")
  .select("*")
  .eq("id", id)
  .single();

  if (!demande) notFound();

  // Journal de consultation : chaque ouverture d'une demande d'aide est
  // tracée, indépendamment des triggers INSERT/UPDATE/DELETE déjà en place
  // (qui ne couvrent pas les lectures). Best-effort : ne bloque jamais l'accès.
  await supabase.from("audit_logs").insert({
  user_id: user.id,
  action: "READ",
  table_name: "demandes_aide",
  record_id: demande.id,
  });

  let coordonnee = "(déchiffrement indisponible)";
  let message: string | null = null;
  try {
  coordonnee = decryptField(demande.coordonnee);
  message = demande.message ? decryptField(demande.message) : null;
  } catch {
  // Clé de chiffrement absente ou invalide : on affiche un message clair
  // plutôt que de faire échouer toute la page.
  }

  const { data: staff } = await supabase
  .from("profiles")
  .select("id, full_name")
  .in("role", ["admin", "super_admin"])
  .eq("is_active", true);

  return (
  <div>
  <Link
  href="/admin/demandes-aide"
  className="text-sm text-primrose-green-dark hover:underline"
  >
  ← Retour aux demandes
  </Link>
  <h1 className="mt-2 font-serif text-2xl text-primrose-green-dark">
  Demande d&apos;aide du{" "}
  {new Date(demande.created_at).toLocaleString("fr-FR")}
  </h1>

  <div className="mt-6">
  <DemandeAideDetailForm
  demande={demande}
  coordonnee={coordonnee}
  message={message}
  staff={staff ?? []}
  />
  </div>
  </div>
  );
}
