import { setRequestLocale, getTranslations } from "next-intl/server";
import { ShieldCheck, LogOut } from "lucide-react";
import { AideForm } from "@/components/forms/aide-form";
import { EmergencyNumbers } from "@/components/sections/emergency-numbers";
import { PageHeader } from "@/components/sections/page-header";
import { getNumerosUrgence } from "@/lib/data/site-settings";
import { buildMetadata } from "@/lib/seo";

/**
 * Page sensible : aucun tracking, aucun cookie tiers, aucun localStorage.
 * Ne pas ajouter d'analytics, de pixel ou de stockage navigateur ici.
 * Les champs sensibles du formulaire sont chiffrés côté serveur avant
 * écriture en base (voir src/lib/crypto.ts et src/actions/aide.ts).
 */
// Numéros d'urgence : propagation plus rapide qu'ailleurs (5 min → 1 min) si
// l'équipe corrige une erreur sur cette page critique.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aide" });
  return buildMetadata({
    locale,
    title: t("titre"),
    description: t("accueil"),
    path: "/besoin-d-aide",
  });
}

export default async function BesoinDAidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aide");
  const tHome = await getTranslations("home.aide");
  const numerosUrgence = await getNumerosUrgence();

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("accueil")} intro={t("texte")} />

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        <div className="space-y-6">
          <p className="rounded-card border border-primrose-alert/30 bg-primrose-white p-5 text-sm font-medium leading-relaxed text-primrose-ink">
            {t("avertissement")}
          </p>

          <EmergencyNumbers numeros={numerosUrgence} />

          <div className="rounded-card bg-primrose-cream p-6">
            <ShieldCheck aria-hidden className="h-6 w-6 text-primrose-forest" />
            <h2 className="mt-3 font-serif text-xl text-primrose-ink">{t("confidentialite.titre")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-primrose-ink/85">{t("confidentialite.texte")}</p>
          </div>

          <p className="flex items-start gap-2 text-sm text-primrose-ink/80">
            <LogOut aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
            {tHome("astuce")}
          </p>
        </div>

        <div className="rounded-card border border-primrose-ink/10 bg-primrose-white p-6 shadow-card md:p-8 lg:self-start">
          <AideForm />
        </div>
      </div>
    </>
  );
}
