"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import { usePathname } from "@/i18n/navigation";

const NEUTRAL_URL = "https://www.weather.com";

function leaveNow() {
  window.location.replace(NEUTRAL_URL);
}

export function QuickExit() {
  const t = useTranslations("quickExit");
  const pathname = usePathname();
  const lastEscapeRef = useRef(0);
  // Back-office exclu : Échap y ferme les boîtes de dialogue, un double appui
  // ferait perdre son travail à l'équipe.
  const isStaffArea = pathname.startsWith("/admin");

  useEffect(() => {
    if (isStaffArea) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      const now = Date.now();
      if (now - lastEscapeRef.current < 600) {
        leaveNow();
        return;
      }
      lastEscapeRef.current = now;
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isStaffArea]);

  if (isStaffArea) return null;

  return (
    <button
      type="button"
      onClick={leaveNow}
      aria-label={t("aria")}
      // Discret par conception : un bouton de fuite trop voyant peut trahir
      // la personne devant un tiers qui regarderait l'écran par-dessus l'épaule.
      className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-1.5 rounded-full border border-primrose-ink/15 bg-primrose-white/95 px-3.5 py-2 text-xs font-medium text-primrose-ink/80 shadow-sm backdrop-blur transition-colors hover:bg-primrose-white hover:text-primrose-ink"
    >
      <LogOut aria-hidden className="h-3.5 w-3.5" />
      {t("label")}
    </button>
  );
}
