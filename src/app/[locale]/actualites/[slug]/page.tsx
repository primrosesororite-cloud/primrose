import { notFound } from "next/navigation";
import Image from "next/image";
import { generateHTML } from "@tiptap/core";
import type { JSONContent } from "@tiptap/react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getActualiteBySlug } from "@/lib/data/actualites";
import { Link } from "@/i18n/navigation";
import { ShareButton } from "@/components/forms/share-button";
import { AnimateIn } from "@/components/motion/animate-in";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { buildMetadata } from "@/lib/seo";
import { tiptapExtensions } from "@/lib/tiptap-extensions";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const actualite = await getActualiteBySlug(slug);
  if (!actualite) return {};

  return buildMetadata({
    locale,
    title: actualite.titre,
    description: actualite.resume ?? "",
    path: `/actualites/${slug}`,
  });
}

export default async function ActualiteDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("actualites");
  const actualite = await getActualiteBySlug(slug);

  // Voir le commentaire équivalent dans formations/[slug]/page.tsx : ce
  // notFound() produit un 200 + noindex plutôt qu'un 404 HTTP strict, par
  // conception du streaming Next.js 16 (sans impact SEO).
  if (!actualite) notFound();

  const contentHtml =
    actualite.contenu && Object.keys(actualite.contenu).length > 0
      ? generateHTML(actualite.contenu as JSONContent, tiptapExtensions)
      : null;

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <ScrollProgress />
      <Link href="/actualites" className="text-sm text-primrose-forest hover:underline">
        ← {t("retour")}
      </Link>

      <AnimateIn className="mt-4">
        {actualite.date_publication && (
          <p className="text-xs text-primrose-ink/75">
            {t("publieLe")}{" "}
            {new Date(actualite.date_publication).toLocaleDateString(locale, {
              dateStyle: "long",
            })}
          </p>
        )}
        <h1 className="mt-2 font-serif text-3xl text-primrose-forest md:text-4xl">
          {actualite.titre}
        </h1>

        {actualite.image_url && (
          <div className="relative mt-6 h-64 w-full overflow-hidden rounded-card">
            <Image
              src={actualite.image_url}
              alt=""
              fill
              sizes="(min-width: 768px) 672px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        {actualite.resume && (
          <p className="mt-6 text-lg text-primrose-ink/90">{actualite.resume}</p>
        )}

        {contentHtml && (
          <div
            className="prose-sm mt-6 max-w-none text-primrose-ink [&_a]:text-primrose-forest [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-primrose-green [&_blockquote]:pl-3 [&_blockquote]:italic [&_h2]:mt-6 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-primrose-forest [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5"
            // Contenu rédigé par l'équipe via l'éditeur admin (Tiptap), pas
            // une entrée utilisateur publique : rendu de confiance.
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        )}

        <div className="mt-8">
          <ShareButton title={actualite.titre} />
        </div>
      </AnimateIn>
    </article>
  );
}
