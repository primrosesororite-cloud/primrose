export async function verifyTurnstile(
  token: string,
  remoteIp: string
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Pas de clé configurée (dev local) : on ne bloque pas, mais on ne
    // considère pas non plus la vérification comme réussie côté prod.
    return process.env.NODE_ENV !== "production";
  }
  if (!token) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: remoteIp,
  });

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body }
  );

  if (!res.ok) return false;
  const data: { success: boolean } = await res.json();
  return data.success === true;
}
