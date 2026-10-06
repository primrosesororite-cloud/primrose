import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AnimateIn } from "@/components/motion/animate-in";
import { staggerContainer } from "@/lib/motion";
import { SectionHeading } from "@/components/sections/section-heading";
import { ArticleCard } from "@/components/sections/article-card";
import type { Database } from "@/types/database";

type Actualite = Database["public"]["Tables"]["actualites"]["Row"];

export function LatestNews({ actualites }: { actualites: Actualite[] }) {
  const t = useTranslations("home.actualites");

  if (actualites.length === 0) return null;

  return (
    <section className="bg-primrose-cream px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <AnimateIn className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow={t("eyebrow")} title={t("titre")} />
          <Link
            href="/actualites"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primrose-forest"
          >
            {t("tout")}
            <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </AnimateIn>

        <AnimateIn variants={staggerContainer} className="mt-10">
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
      </div>
    </section>
  );
}
