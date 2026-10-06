import { requireSuperAdmin } from "@/lib/admin/current-admin";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { UtilisateursTable } from "@/components/admin/utilisateurs/utilisateurs-table";
import { InviteDialog } from "@/components/admin/utilisateurs/invite-dialog";

export default async function AdminUtilisateursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireSuperAdmin(locale);

  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active, created_at");

  const adminClient = createAdminClient();
  const { data: authData } = await adminClient.auth.admin.listUsers();
  const emailById = new Map(authData?.users.map((u) => [u.id, u.email ?? ""]) ?? []);

  const utilisateurs = (profiles ?? []).map((p) => ({
    ...p,
    email: emailById.get(p.id) ?? "",
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-primrose-green-dark">
            Utilisateurs admin
          </h1>
          <p className="mt-1 text-sm text-primrose-ink/70">
            Réservé aux super-administrateurs.
          </p>
        </div>
        <InviteDialog locale={locale} />
      </div>
      <div className="mt-6">
        <UtilisateursTable locale={locale} utilisateurs={utilisateurs} />
      </div>
    </div>
  );
}
