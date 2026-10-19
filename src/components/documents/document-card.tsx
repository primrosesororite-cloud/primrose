import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatTaille } from "@/lib/format";
import { TiltCard } from "@/components/motion/tilt-card";
import type { Database } from "@/types/database";

type Document = Database["public"]["Tables"]["documents"]["Row"];

/** Feuille stylisée au coin plié : évoque le document sans dépendre d'une miniature. */
function DocumentSheet() {
  return (
    <span
      aria-hidden
      className="relative block h-28 w-[5.5rem] rounded-md bg-primrose-white shadow-[0_18px_30px_-16px_rgba(52,80,59,0.55)] transition-transform duration-500 ease-out [clip-path:polygon(0_0,72%_0,100%_22%,100%_100%,0_100%)] motion-safe:group-hover:-translate-y-1.5 motion-safe:group-hover:-rotate-3"
    >
      <span className="absolute right-0 top-0 h-[22%] w-[28%] rounded-bl-md bg-primrose-green/50" />
      <span className="absolute left-3 right-5 top-5 h-1.5 rounded-full bg-primrose-forest/70" />
      <span className="absolute left-3 right-3 top-9 h-1 rounded-full bg-primrose-ink/15" />
      <span className="absolute left-3 right-4 top-12 h-1 rounded-full bg-primrose-ink/15" />
      <span className="absolute left-3 right-6 top-[3.75rem] h-1 rounded-full bg-primrose-ink/15" />
      <span className="absolute bottom-3 left-3 rounded bg-primrose-forest px-1.5 py-0.5 text-[0.6rem] font-bold tracking-wider text-primrose-white">
        PDF
      </span>
    </span>
  );
}

export function DocumentCard({ document }: { document: Document }) {
  const t = useTranslations("documents");
  const locale = useLocale();

  return (
    <TiltCard className="h-full">
      <Link
        href={`/documents/${document.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-card bg-primrose-white shadow-card transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_28px_50px_-24px_rgba(52,80,59,0.45)]"
      >
        <div className="relative flex h-40 items-center justify-center overflow-hidden bg-primrose-cream">
          <span
            aria-hidden
            className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primrose-green/25 transition-transform duration-700 ease-out motion-safe:group-hover:scale-125"
          />
          <DocumentSheet />
          <span className="absolute left-4 top-4 rounded-full bg-primrose-white/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-primrose-forest">
            {t(`categories.${document.categorie}`)}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-serif text-xl leading-snug text-primrose-ink">
            {document.titre}
          </h3>
          {document.description && (
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-primrose-ink/80">
              {document.description}
            </p>
          )}
          <p className="mt-4 text-xs text-primrose-ink/70">
            {document.date_publication && (
              <>
                <time dateTime={document.date_publication}>
                  {new Date(document.date_publication).toLocaleDateString(
                    locale,
                    { dateStyle: "long" },
                  )}
                </time>
                {document.taille_octets !== null && " · "}
              </>
            )}
            {document.taille_octets !== null &&
              t("format", {
                taille: formatTaille(document.taille_octets, locale),
              })}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primrose-forest">
            {t("lire")}
            <ArrowRight
              aria-hidden
              className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1"
            />
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}
