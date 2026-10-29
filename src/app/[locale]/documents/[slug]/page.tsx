import { notFound } from "next/navigation";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, Download, ShieldCheck } from "lucide-react";
import { getDocumentBySlug } from "@/lib/data/documents";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { formatTaille } from "@/lib/format";
import { AnimateIn } from "@/components/motion/animate-in";
import { RevealText } from "@/components/motion/reveal-text";
import { PdfReader } from "@/components/documents/pdf-reader";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const document = await getDocumentBySlug(slug);
  if (!document) return {};

  return buildMetadata({
    locale,
    title: document.titre,
    description: document.description ?? "",
    path: `/documents/${slug}`,
    image: document.couverture_url,
  });
}

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("documents");
  const document = await getDocumentBySlug(slug);

  // Même comportement que actualites/[slug] : 200 + noindex en streaming.
  if (!document) notFound();

  // Fiche sans PDF : seule l'affiche (couverture) est montrée, en grand.
  const pdf = document.fichier_url;
  // `?download=` : Supabase Storage renvoie alors le fichier en pièce jointe.
  const urlTelechargement = pdf ? `${pdf}?download=${encodeURIComponent(`${document.slug}.pdf`)}` : null;
  const taille = document.taille_octets !== null ? formatTaille(document.taille_octets, locale) : null;

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { nom: t("eyebrow"), chemin: "/documents" },
              { nom: document.titre, chemin: `/documents/${document.slug}` },
            ])
          ),
        }}
      />
      <Link
        href="/documents"
        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primrose-forest hover:underline"
      >
        <ArrowLeft
          aria-hidden
          className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:-translate-x-1"
        />
        {t("retour")}
      </Link>

      <header className="mt-6 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          {pdf && document.couverture_url && (
            <AnimateIn className="relative h-48 w-36 shrink-0 overflow-hidden rounded-xl bg-primrose-cream shadow-card">
              <Image
                src={document.couverture_url}
                alt={t("couvertureAlt", { titre: document.titre })}
                fill
                priority
                sizes="144px"
                className="object-cover"
              />
            </AnimateIn>
          )}
        <div>
          <AnimateIn>
            <p className="inline-flex rounded-full bg-primrose-cream px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primrose-forest">
              {t(`categories.${document.categorie}`)}
            </p>
          </AnimateIn>
          <h1 className="mt-4 font-serif text-3xl leading-tight text-primrose-ink md:text-[2.75rem]">
            <RevealText text={document.titre} />
          </h1>
          <AnimateIn delay={0.25}>
            {document.description && (
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-primrose-ink/80 md:text-lg">
                {document.description}
              </p>
            )}
            <p className="mt-3 text-sm text-primrose-ink/70">
              {document.date_publication && (
                <>
                  {t("publieLe")}{" "}
                  <time dateTime={document.date_publication}>
                    {new Date(document.date_publication).toLocaleDateString(locale, { dateStyle: "long" })}
                  </time>
                  {taille && " · "}
                </>
              )}
              {taille && t("format", { taille })}
            </p>
          </AnimateIn>
        </div>
        </div>

        {urlTelechargement && (
        <AnimateIn delay={0.35}>
          <a
            href={urlTelechargement}
            className="group inline-flex items-center gap-2 rounded-full border border-primrose-forest/30 bg-primrose-white px-5 py-3 text-sm font-semibold text-primrose-forest transition-[transform,background-color] duration-300 hover:bg-primrose-cream motion-safe:hover:-translate-y-0.5"
          >
            <Download
              aria-hidden
              className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:translate-y-0.5"
            />
            {taille ? t("telechargerPdf", { taille }) : t("telecharger")}
          </a>
        </AnimateIn>
        )}
      </header>

      {pdf && urlTelechargement ? (
      <>
      <AnimateIn delay={0.2}>
        <p className="mt-8 flex items-start gap-2 rounded-xl bg-primrose-cream px-4 py-3 text-xs leading-relaxed text-primrose-ink/80">
          <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primrose-forest" />
          {t("discretion")}
        </p>
      </AnimateIn>

      <AnimateIn delay={0.3} className="mt-6">
        <PdfReader url={pdf} titre={document.titre} urlTelechargement={urlTelechargement} />
      </AnimateIn>
      </>
      ) : (
        document.couverture_url && (
          <AnimateIn delay={0.2} className="mt-8">
            <figure className="rounded-card bg-primrose-cream p-4 md:p-8">
              <div className="relative mx-auto h-[75vh] max-w-3xl">
                <Image
                  src={document.couverture_url}
                  alt={t("couvertureAlt", { titre: document.titre })}
                  fill
                  priority
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="object-contain drop-shadow-[0_24px_40px_rgba(52,80,59,0.35)]"
                />
              </div>
              <figcaption className="mt-4 text-center">
                <a
                  href={document.couverture_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw text-sm font-semibold text-primrose-forest"
                >
                  {t("ouvrirImage")}
                </a>
              </figcaption>
            </figure>
          </AnimateIn>
        )
      )}
    </article>
  );
}
