import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database";

type Actualite = Database["public"]["Tables"]["actualites"]["Row"];

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const PAGE_SIZE = 6;

export async function getActualitesPage(page = 1): Promise<{
  actualites: Actualite[];
  total: number;
  pageSize: number;
}> {
  if (!isSupabaseConfigured) return { actualites: [], total: 0, pageSize: PAGE_SIZE };

  const supabase = createPublicClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count, error } = await supabase
    .from("actualites")
    .select("*", { count: "exact" })
    .eq("publie", true)
    .lte("date_publication", new Date().toISOString())
    .order("date_publication", { ascending: false })
    .range(from, to);

  if (error || !data) return { actualites: [], total: 0, pageSize: PAGE_SIZE };
  return { actualites: data, total: count ?? 0, pageSize: PAGE_SIZE };
}

export async function getActualiteBySlug(slug: string): Promise<Actualite | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("actualites")
    .select("*")
    .eq("slug", slug)
    .eq("publie", true)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getDernieresActualites(limit = 8): Promise<Pick<Actualite, "id" | "titre" | "slug">[]> {
  const { actualites } = await getActualitesPage(1);
  return actualites.slice(0, limit).map(({ id, titre, slug }) => ({ id, titre, slug }));
}
