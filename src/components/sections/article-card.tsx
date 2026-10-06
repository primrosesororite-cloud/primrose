import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Database } from "@/types/database";

type Actualite = Database["public"]["Tables"]["actualites"]["Row"];

export function ArticleCard({ actualite }: { actualite: Actualite }) {
  const t = useTranslations("actualites");
  const locale = useLocale();

  return (
  <Link
  href={`/actualites/${actualite.slug}`}
  className="group flex h-full flex-col overflow-hidden rounded-card bg-primrose-white shadow-card transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_28px_50px_-24px_rgba(52,80,59,0.45)]"
  >
  <div className="relative aspect-[16/10] w-full overflow-hidden bg-primrose-green/20">
  {actualite.image_url && (
  <Image
  src={actualite.image_url}
  alt={actualite.titre}
  fill
  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
  className="object-cover transition-transform duration-700"
  />
  )}
  </div>
  <div className="flex flex-1 flex-col p-6">
  {actualite.date_publication && (
  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primrose-forest">
  <time dateTime={actualite.date_publication}>
  {new Date(actualite.date_publication).toLocaleDateString(locale, { dateStyle: "long" })}
  </time>
  </p>
  )}
  <h3 className="mt-3 font-serif text-xl leading-snug text-primrose-ink">{actualite.titre}</h3>
  {actualite.resume && (
  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-primrose-ink/80">
  {actualite.resume}
  </p>
  )}
  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primrose-forest">
  {t("lire")}
  <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300" />
  </span>
  </div>
  </Link>
  );
}
