import { createPublicClient } from "@/lib/supabase/public";
import type { Database, FormationStatut } from "@/types/database";

type Formation = Database["public"]["Tables"]["formations"]["Row"];

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getFormations({
  publicCible,
  statut,
}: {
  publicCible?: string;
  statut?: FormationStatut;
} = {}): Promise<Formation[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = createPublicClient();
  let query = supabase.from("formations").select("*").neq("statut", "brouillon");

  if (statut) query = query.eq("statut", statut);
  if (publicCible) query = query.eq("public_cible", publicCible);

  const { data, error } = await query.order("date_debut", { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function getFormationBySlug(slug: string): Promise<Formation | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("formations")
    .select("*")
    .eq("slug", slug)
    .neq("statut", "brouillon")
    .single();

  if (error || !data) return null;
  return data;
}
