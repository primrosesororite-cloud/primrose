import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

const STAFF_ROLES: UserRole[] = ["super_admin", "admin", "editor"];

/**
 * Vérification défense-en-profondeur : le proxy garde déjà /admin/*, mais
 * chaque route serveur doit revalider elle-même (recommandation Next.js —
 * un changement de matcher ne doit jamais être le seul rempart).
 */
export async function requireStaff(locale: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect({ href: "/connexion", locale });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active")
    .eq("id", userData.user!.id)
    .single();

  if (!profile?.is_active || !STAFF_ROLES.includes(profile.role)) {
    redirect({ href: "/connexion", locale });
  }

  return { user: userData.user!, profile: profile! };
}

export async function requireAdmin(locale: string) {
  const { user, profile } = await requireStaff(locale);
  if (profile.role === "editor") {
    redirect({ href: "/admin", locale });
  }
  return { user, profile };
}

export async function requireSuperAdmin(locale: string) {
  const { user, profile } = await requireStaff(locale);
  if (profile.role !== "super_admin") {
    redirect({ href: "/admin", locale });
  }
  return { user, profile };
}
