import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database";

type ReseauSocial = Database["public"]["Tables"]["reseaux_sociaux"]["Row"];
type ParametresSite = Database["public"]["Tables"]["parametres_site"]["Row"];

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Repli affiché tant que le projet Supabase n'est pas provisionné. */
const FALLBACK_RESEAUX: Pick<ReseauSocial, "plateforme" | "url">[] = [
  { plateforme: "instagram", url: "https://instagram.com/primrose.sororite" },
  { plateforme: "x", url: "https://x.com/primrose_sororite" },
  { plateforme: "facebook", url: "https://facebook.com/primrose.sororite" },
  { plateforme: "youtube", url: "https://youtube.com/@primrose-sororite" },
  { plateforme: "tiktok", url: "https://tiktok.com/@primrose.sororite" },
];

export async function getReseauxSociaux(): Promise<
  Pick<ReseauSocial, "plateforme" | "url">[]
> {
  if (!isSupabaseConfigured) return FALLBACK_RESEAUX;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("reseaux_sociaux")
    .select("plateforme, url")
    .eq("actif", true);

  if (error || !data || data.length === 0) return FALLBACK_RESEAUX;
  return data;
}

export async function getParametresSite(): Promise<
  Pick<ParametresSite, "email" | "telephone" | "numeros_urgence"> | null
> {
  if (!isSupabaseConfigured) return null;

  const supabase = createPublicClient();
  const { data } = await supabase
    .from("parametres_site")
    .select("email, telephone, numeros_urgence")
    .eq("id", 1)
    .single();

  return data;
}

export type NumeroUrgence = { label: string; numero: string };

function isNumeroUrgence(value: unknown): value is NumeroUrgence {
  return (
    typeof value === "object" &&
    value !== null &&
    "label" in value &&
    "numero" in value
  );
}

/** Un numéro de type "À RENSEIGNER" (placeholder) n'est jamais un vrai numéro appelable. */
export function isNumeroAppelable(numero: string): boolean {
  return /\d{4,}/.test(numero);
}

export async function getNumerosUrgence(): Promise<NumeroUrgence[]> {
  const parametres = await getParametresSite();
  return (parametres?.numeros_urgence ?? []).filter(isNumeroUrgence);
}
