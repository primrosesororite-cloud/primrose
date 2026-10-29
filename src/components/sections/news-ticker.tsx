import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandText } from "@/components/brand-text";
import { cn } from "@/lib/utils";
import type { BandeauItem } from "@/lib/data/bandeau";

/** Nombre minimal d'éléments par piste : assez pour couvrir un grand écran sans trou. */
const MIN_PAR_PISTE = 12;
/** Secondes par élément : vitesse de lecture constante, quel que soit le nombre d'éléments. */
const SECONDES_PAR_ELEMENT = 6;

/**
 * Bandeau « À la une » façon chaîne d'information : étiquette, défilement
 * continu sur toute la largeur, bords en fondu. Peu d'éléments ? La liste est
 * répétée pour qu'il n'y ait jamais de vide. Pause au survol et au focus ;
 * sous prefers-reduced-motion, il reste immobile et défilable à la main.
 * Les répétitions sont masquées aux lecteurs d'écran (chaque titre n'est lu
 * qu'une fois).
 */
export function NewsTicker({ items }: { items: BandeauItem[] }) {
  const t = useTranslations("actualites");

  if (items.length === 0) return null;

  const repetitions = Math.max(1, Math.ceil(MIN_PAR_PISTE / items.length));
  const piste = Array.from({ length: repetitions }, () => items).flat();
  const duree = piste.length * SECONDES_PAR_ELEMENT;

  return (
    <section
      aria-label={t("bandeau")}
      className="group relative overflow-hidden border-y border-primrose-green/30 bg-primrose-cream"
    >
      <div className="flex items-stretch">
        <p className="relative z-10 flex shrink-0 items-center gap-2.5 bg-primrose-forest px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-primrose-white shadow-[8px_0_16px_-8px_rgba(52,80,59,0.6)] sm:px-5">
          <span aria-hidden className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primrose-green opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primrose-green" />
          </span>
          {t("bandeau")}
        </p>
        <div className="flex min-w-0 flex-1 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_3%,black_94%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="flex w-max animate-marquee py-2.5 group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] motion-reduce:animate-none"
            style={{ animationDuration: `${duree}s` }}
          >
            <Piste items={piste} uniques={items.length} />
            <Piste items={piste} uniques={0} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** `uniques` : nombre de premiers éléments lus par les lecteurs d'écran (0 = piste entièrement décorative). */
function Piste({ items, uniques }: { items: BandeauItem[]; uniques: number }) {
  return (
    <ul aria-hidden={uniques === 0 || undefined} className="flex shrink-0 items-center">
      {items.map((item, index) => {
        const repetition = index >= uniques;
        return (
          <li
            key={`${item.cle}-${index}`}
            aria-hidden={(uniques > 0 && repetition) || undefined}
            className="flex shrink-0 items-center gap-3 pr-8"
          >
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]",
                item.aide ? "bg-primrose-alert text-primrose-white" : "bg-primrose-forest/10 text-primrose-forest"
              )}
            >
              {item.etiquette}
            </span>
            {item.date && (
              <span className="text-xs font-semibold uppercase tracking-wide text-primrose-forest">{item.date}</span>
            )}
            <Link
              href={item.href}
              tabIndex={repetition ? -1 : undefined}
              className="whitespace-nowrap font-serif text-[1.05rem] text-primrose-ink underline-offset-4 hover:underline"
            >
              <BrandText>{item.titre}</BrandText>
            </Link>
            <span aria-hidden className="ml-5 h-1.5 w-1.5 shrink-0 rounded-full bg-primrose-green" />
          </li>
        );
      })}
    </ul>
  );
}
