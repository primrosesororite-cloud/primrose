import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Lock } from "lucide-react";
import type { ApercuLien } from "@/types/database";

/**
 * Aperçu d'un article externe présenté comme une fenêtre de navigateur
 * (revue de presse). Toute la carte est un lien qui ouvre le site du média
 * dans un nouvel onglet. Les images viennent de notre stockage (copiées à
 * l'enregistrement) : aucun appel au site externe à l'affichage.
 */
export function LienApercu({ url, apercu }: { url: string; apercu: ApercuLien | null }) {
  const t = useTranslations("actualites.revuePresse");
  const adresse = new URL(url);
  const domaine = apercu?.domaine ?? adresse.hostname.replace(/^www\./, "");
  const site = apercu?.site ?? domaine;
  const chemin = decodeURIComponent(adresse.pathname).replace(/\/$/, "");

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl bg-primrose-white shadow-card ring-1 ring-primrose-green/30 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(52,80,59,0.55)] focus-visible:-translate-y-1"
    >
      {/* Barre de fenêtre : décorative, ignorée par les lecteurs d'écran */}
      <div aria-hidden className="flex items-center gap-3 border-b border-primrose-green/25 bg-primrose-cream px-4 py-2.5">
        <span aria-hidden className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-primrose-forest/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-primrose-green-dark/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-primrose-green/70" />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-primrose-white px-3 py-1 text-xs text-primrose-ink/70 ring-1 ring-primrose-ink/5">
          <Lock aria-hidden className="h-3 w-3 shrink-0 text-primrose-forest" />
          <span className="truncate">
            <span className="font-semibold text-primrose-ink">{domaine}</span>
            <span aria-hidden>{chemin}</span>
          </span>
        </span>
        <ArrowUpRight
          aria-hidden
          className="h-4 w-4 shrink-0 text-primrose-forest transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
        />
      </div>

      {apercu?.image_url && (
        <div className="relative aspect-[1.91/1] w-full overflow-hidden bg-primrose-cream">
          <Image
            src={apercu.image_url}
            alt=""
            fill
            sizes="(min-width: 768px) 672px, 100vw"
            className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
          />
        </div>
      )}

      <div className="p-5 md:p-6">
        <p className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-primrose-forest">
          {apercu?.icone_url && (
            <Image
              src={apercu.icone_url}
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 rounded-md object-cover ring-1 ring-primrose-ink/10"
            />
          )}
          <span className="truncate">{site}</span>
          {apercu?.auteur && (
            <span className="truncate font-medium normal-case tracking-normal text-primrose-ink/60">
              · {t("par", { auteur: apercu.auteur })}
            </span>
          )}
        </p>
        <p className="mt-3 font-serif text-xl leading-snug text-primrose-ink md:text-2xl">
          {apercu?.titre ?? t("lireSur", { site })}
        </p>
        {apercu?.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-primrose-ink/75">{apercu.description}</p>
        )}
        <span className="btn-sheen mt-5 inline-flex items-center gap-2 rounded-full bg-primrose-forest px-5 py-2.5 text-sm font-semibold text-primrose-white">
          {t("lireSur", { site })}
          <ArrowUpRight
            aria-hidden
            className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
          />
          <span className="sr-only">{t("nouvelOnglet")}</span>
        </span>
      </div>
    </a>
  );
}
