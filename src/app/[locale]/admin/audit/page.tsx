import { requireSuperAdmin } from "@/lib/admin/current-admin";
import { createClient } from "@/lib/supabase/server";
import { AuditTable } from "@/components/admin/audit/audit-table";

export default async function AdminAuditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireSuperAdmin(locale);

  const supabase = await createClient();
  const [{ data: logs }, { data: profiles }] = await Promise.all([
    supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500),
    supabase.from("profiles").select("id, full_name"),
  ]);

  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));
  const entries = (logs ?? []).map((log) => ({
    ...log,
    userName: log.user_id ? (nameById.get(log.user_id) ?? "Utilisateur supprimé") : "Système",
  }));

  return (
    <div>
      <h1 className="font-serif text-2xl text-primrose-green-dark">Journal d&apos;audit</h1>
      <p className="mt-1 text-sm text-primrose-ink/70">
        Qui a fait quoi, quand. Réservé aux super-administrateurs. 500 dernières entrées.
      </p>
      <div className="mt-6">
        <AuditTable entries={entries} />
      </div>
    </div>
  );
}
