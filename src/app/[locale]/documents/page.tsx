import { setRequestLocale, getTranslations } from "next-intl/server";
import { getDocumentsPublies } from "@/lib/data/documents";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { AnimateIn } from "@/components/motion/animate-in";
import { DocumentsExplorer } from "@/components/documents/documents-explorer";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "documents" });
  return buildMetadata({ locale, title: t("titre"), description: t("texte"), path: "/documents" });
}

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("documents");
  const documents = await getDocumentsPublies();

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("titre")} intro={t("texte")} />
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        {documents.length === 0 ? (
          <p className="rounded-card bg-primrose-cream p-8 text-center text-primrose-ink/80">{t("vide")}</p>
        ) : (
          <AnimateIn>
            <DocumentsExplorer documents={documents} />
          </AnimateIn>
        )}
      </section>
    </>
  );
}
