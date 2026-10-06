import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Client Supabase avec la clé service_role : contourne RLS, réservé aux
 * opérations serveur qui l'exigent réellement (Auth Admin API pour inviter/
 * désactiver un utilisateur). Ne jamais importer ce module depuis un composant
 * client ni l'utiliser pour de simples lectures/écritures déjà couvertes par
 * les policies RLS — celles-ci doivent passer par lib/supabase/server.ts.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
