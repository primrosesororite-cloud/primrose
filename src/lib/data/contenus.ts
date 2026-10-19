import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database";

type ChiffreCle = Database["public"]["Tables"]["chiffres_cles"]["Row"];

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Contenus éditables depuis l'admin. La base ne contient que le français :
 * dans les autres langues, ou si Supabase est indisponible, le site retombe
 * sur les textes des fichiers de traduction (src/messages), jamais sur une page vide.
 */
const lireBase = (locale: string) => isSupabaseConfigured && locale === routing.defaultLocale;

export const AXES = ["prevenir", "soutenir", "plaider", "former"] as const;
export type AxeKey = (typeof AXES)[number];

export type MissionContent = {
  key: AxeKey;
  titre: string;
  description: string;
  detail: string;
  valeurs: string[];
  actions: string[];
};

async function missionsDepuisMessages(locale: string): Promise<MissionContent[]> {
  const t = await getTranslations({ locale, namespace: "missions" });
  return AXES.map((key) => ({
    key,
    titre: t(`${key}.titre`),
    description: t(`${key}.description`),
    detail: t(`${key}.detail`),
    valeurs: t.raw(`${key}.valeurs`) as string[],
    actions: t.raw(`${key}.actions`) as string[],
  }));
}

export async function getMissions(locale: string): Promise<MissionContent[]> {
  const defauts = await missionsDepuisMessages(locale);
  if (!lireBase(locale)) return defauts;

  const supabase = createPublicClient();
  const [missionsRes, valeursRes] = await Promise.all([
    supabase.from("missions").select("*").eq("actif", true).order("ordre", { ascending: true }),
    supabase.from("valeurs").select("*").order("ordre", { ascending: true }),
  ]);
  if (missionsRes.error || !missionsRes.data || missionsRes.data.length === 0) return defauts;

  const parCle = new Map(defauts.map((m) => [m.key, m]));
  const missions = missionsRes.data.flatMap((row): MissionContent[] => {
    const base = parCle.get(row.slug as AxeKey);
    if (!base) return [];
    // `actions` n'existe qu'après la migration 003 : sans elle, on garde les textes d'origine.
    const migre = Array.isArray(row.actions);
    const valeurs =
      valeursRes.data?.filter((v) => v.mission_id === row.id).map((v) => v.libelle) ?? [];

    return [
      {
        key: base.key,
        titre: row.titre,
        description: row.description,
        detail: row.detail ?? base.detail,
        valeurs: migre || valeurs.length > 0 ? valeurs : base.valeurs,
        actions: migre ? row.actions : base.actions,
      },
    ];
  });

  return missions.length > 0 ? missions : defauts;
}

export type VisionContent = { titre: string; texte: string; valeurs: string[] };

export async function getVision(locale: string): Promise<VisionContent> {
  const t = await getTranslations({ locale, namespace: "home.vision" });
  const defaut: VisionContent = {
    titre: t("titre"),
    texte: t("texte"),
    valeurs: t.raw("valeurs") as string[],
  };
  if (!lireBase(locale)) return defaut;

  const supabase = createPublicClient();
  const { data } = await supabase
    .from("pages_content")
    .select("content")
    .eq("key", "home.vision")
    .single();
  if (!data) return defaut;

  const { titre, texte, valeurs } = data.content;
  return {
    titre: typeof titre === "string" && titre.trim() ? titre : defaut.titre,
    texte: typeof texte === "string" && texte.trim() ? texte : defaut.texte,
    valeurs:
      Array.isArray(valeurs) && valeurs.every((v) => typeof v === "string")
        ? (valeurs as string[])
        : defaut.valeurs,
  };
}

/** Chiffres clés actifs et non nuls : tant qu'aucun n'est renseigné, la section est masquée. */
export async function getChiffresCles(): Promise<ChiffreCle[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("chiffres_cles")
    .select("*")
    .eq("actif", true)
    .order("ordre", { ascending: true });

  if (error || !data) return [];
  return data.filter((chiffre) => chiffre.valeur > 0);
}
