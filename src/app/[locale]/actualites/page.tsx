import { setRequestLocale, getTranslations } from "next-intl/server";
import { getActualitesPage, getDernieresActualites } from "@/lib/data/actualites";
import { NewsTicker } from "@/components/sections/news-ticker";
import { Link } from "@/i18n/navigation";
import { AnimateIn } from "@/components/motion/animate-in";
import { stagger } from "@/lib/motion";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { ArticleCard } from "@/components/sections/article-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "actualites" });
  return buildMetadata({ locale, title: t("titre"), description: t("texte"), path: "/actualites" });
}

export default async function ActualitesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("actualites");

  const page = Math.max(1, Number(pageParam) || 1);
  const { actualites, total, pageSize } = await getActualitesPage(page);
  const dernieres = await getDernieresActualites();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
  <>
  <PageHeader eyebrow={t("eyebrow")} title={t("titre")} intro={t("texte")} />
    <NewsTicker items={dernieres} />
  <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">

  {actualites.length === 0 ? (
  <p className="rounded-card bg-primrose-cream p-8 text-center text-primrose-ink/80">
  {t("vide")}
  </p>
  ) : (
  <>
  <AnimateIn variants={stagger}>
  <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {actualites.map((actualite) => (
  <li key={actualite.id}>
  <AnimateIn className="h-full">
  <ArticleCard actualite={actualite} />
  </AnimateIn>
  </li>
  ))}
  </ul>
  </AnimateIn>

  {totalPages > 1 && (
  <nav
  aria-label="Pagination"
  className="mt-10 flex items-center justify-center gap-4"
  >
  <Link
  href={`/actualites?page=${page - 1}`}
  aria-disabled={page <= 1}
  className={
  page <= 1
  ? "pointer-events-none rounded-full px-4 py-2 text-sm text-primrose-ink/30"
  : "rounded-full px-4 py-2 text-sm text-primrose-forest hover:bg-primrose-cream"
  }
  >
  {t("precedent")}
  </Link>
  <p className="text-sm text-primrose-ink/70">
  {t("page", { page, total: totalPages })}
  </p>
  <Link
  href={`/actualites?page=${page + 1}`}
  aria-disabled={page >= totalPages}
  className={
  page >= totalPages
  ? "pointer-events-none rounded-full px-4 py-2 text-sm text-primrose-ink/30"
  : "rounded-full px-4 py-2 text-sm text-primrose-forest hover:bg-primrose-cream"
  }
  >
  {t("suivant")}
  </Link>
  </nav>
  )}
  </>
  )}
  </section>
  </>
  );
}
