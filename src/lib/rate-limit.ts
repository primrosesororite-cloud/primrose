/**
 * Limiteur de débit best-effort, en mémoire, par instance de serveur.
 * Suffisant pour dissuader le spam automatisé basique sur les formulaires publics.
 * En production multi-instance (Vercel), remplacer par un store partagé
 * (ex. Upstash Redis) pour une limite fiable entre instances.
 */

const hits = new Map<string, number[]>();

export function checkRateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number }
): { allowed: boolean } {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter(
    (t) => now - t < windowMs
  );

  if (timestamps.length >= max) {
    hits.set(key, timestamps);
    return { allowed: false };
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return { allowed: true };
}

export async function getClientIp(): Promise<string> {
  const { headers } = await import("next/headers");
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}
