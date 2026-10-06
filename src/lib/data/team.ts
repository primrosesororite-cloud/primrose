import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database";

type Equipe = Database["public"]["Tables"]["equipe"]["Row"];
type Partenaire = Database["public"]["Tables"]["partenaires"]["Row"];

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getEquipe(): Promise<Equipe[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("equipe")
    .select("*")
    .eq("actif", true)
    .order("ordre", { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function getPartenaires(): Promise<Partenaire[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("partenaires")
    .select("*")
    .eq("actif", true)
    .order("ordre", { ascending: true });

  if (error || !data) return [];
  return data;
}
