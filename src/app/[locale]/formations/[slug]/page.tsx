import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getFormationBySlug } from "@/lib/data/formations";
import { FormationInscriptionForm } from "@/components/forms/formation-inscription-form";
import { Link } from "@/i18n/navigation";
import { AnimateIn } from "@/components/motion/animate-in";
import { PageHeader } from "@/components/sections/page-header";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const formation = await getFormationBySlug(slug);
  if (!formation) return {};

  return buildMetadata({
  locale,
  title: formation.titre,
  description: formation.description ?? "",
  path: `/formations/${slug}`,
  });
}

export default async function FormationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("formations");
  const formation = await getFormationBySlug(slug);

  // notFound() ici renvoie un 200 + <meta noindex> plutôt qu'un vrai 404 HTTP :
  // le await ci-dessus a déjà fait démarrer le streaming de la réponse (shell +
  // loading.tsx), donc le status code ne peut plus être modifié. Comportement
  // documenté par Next.js 16 ; un vrai 404 nécessiterait de vérifier le slug
  // dans proxy.ts avant le streaming. Sans impact SEO (noindex injecté).
  if (!formation) notFound();

  return (
  <>
  <PageHeader
  eyebrow={t(`statut.${formation.statut}`)}
  title={formation.titre}
  intro={formation.description ?? undefined}
  />
  <section className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
  <Link href="/formations" className="text-sm font-semibold text-primrose-forest hover:underline">
  ← {t("retour")}
  </Link>

  <AnimateIn className="mt-6">
  <dl className="grid gap-4 rounded-card bg-primrose-cream p-6 text-sm text-primrose-ink/85 sm:grid-cols-2">
  {formation.lieu && (
  <div>
  <dt className="font-medium text-primrose-ink">{t("lieu")}</dt>
  <dd>{formation.lieu}</dd>
  </div>
  )}
  {formation.date_debut && (
  <div>
  <dt className="font-medium text-primrose-ink">{t("dateDebut")}</dt>
  <dd>
  {new Date(formation.date_debut).toLocaleDateString(locale, {
  dateStyle: "long",
  })}
  </dd>
  </div>
  )}
  {formation.places != null && (
  <div>
  <dt className="font-medium text-primrose-ink">{t("places")}</dt>
  <dd>{formation.places}</dd>
  </div>
  )}
  {formation.public_cible && (
  <div>
  <dt className="font-medium text-primrose-ink">{t("filtrerPublic")}</dt>
  <dd>{formation.public_cible}</dd>
  </div>
  )}
  </dl>
  </AnimateIn>

  <AnimateIn delay={0.1} className="mt-10 rounded-card border border-primrose-ink/10 bg-primrose-white p-6 shadow-card md:p-8">
  <h2 className="font-serif text-2xl text-primrose-forest">
  {t("inscription.titre")}
  </h2>
  <div className="mt-4">
  {formation.statut === "ouverte" ? (
  <FormationInscriptionForm formationId={formation.id} />
  ) : (
  <p className="text-sm text-primrose-ink/70">{t("inscription.complet")}</p>
  )}
  </div>
  </AnimateIn>
  </section>
  </>
  );
}
