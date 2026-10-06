import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database";

type Evenement = Database["public"]["Tables"]["evenements"]["Row"];

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getEvenementsPublies(): Promise<Evenement[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("evenements")
    .select("*")
    .eq("publie", true)
    .order("date_evenement", { ascending: true });

  if (error || !data) return [];
  return data;
}
