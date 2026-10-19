import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database";

type Document = Database["public"]["Tables"]["documents"]["Row"];

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getDocumentsPublies(limit?: number): Promise<Document[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = createPublicClient();
  let query = supabase
    .from("documents")
    .select("*")
    .eq("publie", true)
    .order("date_publication", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

export async function getDocumentBySlug(slug: string): Promise<Document | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("slug", slug)
    .eq("publie", true)
    .single();

  if (error || !data) return null;
  return data;
}
