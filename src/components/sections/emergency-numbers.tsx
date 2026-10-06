import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { isNumeroAppelable, type NumeroUrgence } from "@/lib/data/site-settings";

export function EmergencyNumbers({ numeros }: { numeros: NumeroUrgence[] }) {
  const t = useTranslations("aide.urgences");

  return (
  <section className="rounded-card bg-primrose-alert/10 p-6" aria-labelledby="urgences-titre">
  {/* texte en primrose-ink plutôt qu'alert : le rouge sur ce fond
  légèrement teinté ne passe pas le contraste WCAG AA (mesuré à 4,1:1) */}
  <h2 id="urgences-titre" className="font-serif text-xl text-primrose-ink">{t("titre")}</h2>

  {numeros.length === 0 ? (
  <p className="mt-2 text-sm text-primrose-ink">{t("aVenir")}</p>
  ) : (
  <ul className="mt-4 space-y-3">
  {numeros.map((n) => (
  <li key={n.label} className="flex items-center justify-between gap-3">
  <div>
  <p className="text-sm font-medium text-primrose-ink">{n.label}</p>
  {isNumeroAppelable(n.numero) && (
  <p className="text-sm text-primrose-ink">{n.numero}</p>
  )}
  </div>
  {isNumeroAppelable(n.numero) && (
  <a
  href={`tel:${n.numero.replace(/\s+/g, "")}`}
  className="inline-flex items-center gap-1.5 rounded-full bg-primrose-alert px-4 py-2 text-sm font-medium text-primrose-white hover:bg-primrose-alert/90"
  >
  <Phone aria-hidden className="h-4 w-4" />
  {t("appeler")}
  </a>
  )}
  </li>
  ))}
  </ul>
  )}
  </section>
  );
}
