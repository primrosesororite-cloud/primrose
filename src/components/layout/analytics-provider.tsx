"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";

const CONSENT_KEY = "primrose-analytics-consent";
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

type Consent = "granted" | "denied" | null;

/**
 * Bannière de consentement minimaliste + chargement conditionnel de
 * Plausible (analytics sans cookie). N'écrit RIEN et ne charge RIEN sur
 * /besoin-d-aide, quel que soit le consentement — cette page reste
 * strictement exempte de tout tracking (contrainte non négociable).
 */
export function AnalyticsProvider() {
  const t = useTranslations("cookies");
  const pathname = usePathname();
  const isSensitivePage = pathname === "/besoin-d-aide";
  const [consent, setConsent] = useState<Consent>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (isSensitivePage) return;
    try {
      const stored = window.localStorage.getItem(CONSENT_KEY);
      // localStorage n'existe pas côté serveur : cette lecture ne peut se
      // faire qu'après montage, pour éviter un mismatch d'hydratation. C'est
      // l'un des rares cas légitimes de setState synchrone dans un effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored === "granted" || stored === "denied") setConsent(stored);
    } catch {
      // localStorage indisponible (navigation privée stricte, etc.) : on
      // se contente de ne jamais afficher la bannière, sans faire échouer la page.
    }
    setHydrated(true);
  }, [isSensitivePage]);

  function choose(value: Exclude<Consent, null>) {
    setConsent(value);
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Idem : l'échec d'écriture ne doit pas bloquer le choix de l'utilisateur.
    }
  }

  if (isSensitivePage) return null;

  return (
    <>
      {consent === "granted" && PLAUSIBLE_DOMAIN && (
        <Script
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}

      {hydrated && consent === null && PLAUSIBLE_DOMAIN && (
        <div
          role="dialog"
          aria-label={t("titre")}
          className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-lg flex-col gap-3 rounded-card bg-primrose-white p-4 shadow-card ring-1 ring-primrose-ink/10 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-xs text-primrose-ink/80">{t("texte")}</p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="rounded-full border border-primrose-ink/15 px-3 py-1.5 text-xs font-medium text-primrose-ink hover:bg-primrose-cream"
            >
              {t("refuser")}
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="rounded-full bg-primrose-forest px-3 py-1.5 text-xs font-medium text-primrose-white hover:bg-primrose-forest/90"
            >
              {t("accepter")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
