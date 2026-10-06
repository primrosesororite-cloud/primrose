"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSuperAdmin } from "@/lib/admin/current-admin";
import { inviteSchema } from "@/lib/validations/admin/utilisateurs";
import type { UserRole } from "@/types/database";

type ActionResult = { error?: string } | void;

export async function inviteUtilisateur(locale: string, formData: FormData): Promise<ActionResult> {
  await requireSuperAdmin(locale);

  const parsed = inviteSchema.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName"),
  });
  if (!parsed.success) return { error: "Champs invalides." };

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.inviteUserByEmail(parsed.data.email, {
    data: { full_name: parsed.data.fullName },
  });

  if (error) return { error: "L'invitation a échoué : " + error.message };
  revalidatePath("/admin/utilisateurs");
}

export async function updateUtilisateurRole(
  locale: string,
  id: string,
  role: UserRole
): Promise<ActionResult> {
  await requireSuperAdmin(locale);

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/utilisateurs");
}

export async function toggleUtilisateurActif(
  locale: string,
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  await requireSuperAdmin(locale);

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ is_active: isActive }).eq("id", id);
  if (error) return { error: "La mise à jour a échoué." };
  revalidatePath("/admin/utilisateurs");
}
