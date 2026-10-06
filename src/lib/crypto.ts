import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

/**
 * Chiffrement applicatif (AES-256-GCM) des champs sensibles de `demandes_aide`
 * (coordonnée, message) avant écriture en base. La clé ne transite jamais par
 * Supabase : elle vit uniquement dans les variables d'environnement serveur.
 *
 * Volontairement strict : si la clé n'est pas configurée, on refuse d'écrire
 * plutôt que de stocker une donnée sensible en clair par défaut. Générer une
 * clé : `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey(): Buffer {
  const raw = process.env.DEMANDES_AIDE_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      "DEMANDES_AIDE_ENCRYPTION_KEY n'est pas configurée : impossible de chiffrer les données sensibles."
    );
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error(
      "DEMANDES_AIDE_ENCRYPTION_KEY doit être une clé de 32 octets encodée en base64."
    );
  }
  return key;
}

export function encryptField(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv, authTag, ciphertext].map((buf) => buf.toString("base64")).join(".");
}

export function decryptField(stored: string): string {
  const key = getKey();
  const [ivB64, tagB64, dataB64] = stored.split(".");
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("Format chiffré invalide.");
  }
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const data = Buffer.from(dataB64, "base64");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(data), decipher.final()]);
  return plaintext.toString("utf8");
}
