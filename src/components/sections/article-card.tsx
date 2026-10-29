import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Newspaper } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { TiltCard } from "@/components/motion/tilt-card";
import { RevealImage } from "@/components/motion/reveal-image";
import { BrandText } from "@/components/brand-text";
import type { Database } from "@/types/database";

type Actualite = Database["public"]["Tables"]["actualites"]["Row"];

export function ArticleCard({ actualite }: { actualite: Actualite }) {
  const t = useTranslations("actualites");
  const locale = useLocale();
  // Revue de presse sans image propre : la photo de l'article du média.
  const image = actualite.image_url ?? actualite.apercu?.image_url ?? null;

  return (
  <TiltCard className="h-full">
  <Link
  href={`/actualites/${actualite.slug}`}
  className="glass-surface group flex h-full flex-col overflow-hidden rounded-card transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_28px_50px_-24px_rgba(52,80,59,0.45)]"
  >
  <div className="relative aspect-[16/10] w-full overflow-hidden bg-primrose-green/20">
  {image && (
  <RevealImage className="absolute inset-0">
  <Image
  src={image}
  alt={actualite.titre}
  fill
  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
  className="object-cover object-top transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
  />
  </RevealImage>
  )}
  {actualite.lien_externe && (
  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-primrose-white/95 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-primrose-forest shadow-sm">
  <Newspaper aria-hidden className="h-3.5 w-3.5" />
  {t("revuePresse.etiquette")}
  </span>
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
  <BrandText>{actualite.resume}</BrandText>
  </p>
  )}
  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primrose-forest">
  {t("lire")}
  <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1" />
  </span>
  </div>
  </Link>
  </TiltCard>
  );
}
