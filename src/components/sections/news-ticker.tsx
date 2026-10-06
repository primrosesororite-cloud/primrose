import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export type TickerItem = { id: string; titre: string; slug: string };

/**
 * Bande qui défile en boucle avec les dernières actualités. Pause au survol
 * et au focus ; sous prefers-reduced-motion, elle reste statique et défilable
 * à la main. La copie dupliquée est masquée aux lecteurs d'écran.
 */
export function NewsTicker({ items }: { items: TickerItem[] }) {
  const t = useTranslations("actualites");

  if (items.length === 0) return null;

  return (
    <section
      aria-label={t("bandeau")}
      className="group overflow-hidden border-y border-primrose-green/30 bg-primrose-green/25"
    >
      <div className="flex items-stretch">
        <p className="flex shrink-0 items-center bg-primrose-forest px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primrose-white">
          {t("bandeau")}
        </p>
        <div className="flex min-w-0 flex-1 overflow-x-auto motion-reduce:overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max animate-marquee py-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            <TickerTrack items={items} />
            <TickerTrack items={items} duplicate />
          </div>
        </div>
      </div>
    </section>
  );
}

function TickerTrack({ items, duplicate = false }: { items: TickerItem[]; duplicate?: boolean }) {
  return (
    <ul aria-hidden={duplicate || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item) => (
        <li key={`${item.id}-${duplicate ? "b" : "a"}`} className="flex shrink-0 items-center gap-10">
          <Link
            href={`/actualites/${item.slug}`}
            tabIndex={duplicate ? -1 : undefined}
            className="whitespace-nowrap font-serif text-lg text-primrose-ink hover:underline underline-offset-4"
          >
            {item.titre}
          </Link>
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primrose-forest" />
        </li>
      ))}
    </ul>
  );
}
