import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Client anonyme SANS accès aux cookies de session, réservé aux lectures
 * publiques (contenus déjà couverts par une policy RLS "lecture publique").
 * Contrairement à lib/supabase/server.ts, ne pas appeler `cookies()` permet
 * à Next.js de garder ces routes statiques/ISR plutôt que de les forcer en
 * rendu dynamique à chaque requête — c'est tout l'intérêt de ce client séparé.
 * Ne jamais l'utiliser pour une donnée qui dépend de l'utilisateur connecté.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
