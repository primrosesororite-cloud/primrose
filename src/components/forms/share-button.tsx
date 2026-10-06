"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Share2, Check } from "lucide-react";

export function ShareButton({ title }: { title: string }) {
  const t = useTranslations("actualites");
  const [copied, setCopied] = useState(false);

  async function handleShare() {
  const url = window.location.href;

  if (navigator.share) {
  try {
  await navigator.share({ title, url });
  } catch {
  // Partage annulé par l'utilisateur : rien à faire.
  }
  return;
  }

  await navigator.clipboard.writeText(url);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
  }

  return (
  <button
  type="button"
  onClick={handleShare}
  className="inline-flex items-center gap-1.5 rounded-full border border-primrose-green-dark px-4 py-2 text-sm font-medium text-primrose-forest hover:bg-primrose-cream"
  >
  {copied ? (
  <>
  <Check aria-hidden className="h-4 w-4" />
  {t("lienCopie")}
  </>
  ) : (
  <>
  <Share2 aria-hidden className="h-4 w-4" />
  {t("partager")}
  </>
  )}
  </button>
  );
}
