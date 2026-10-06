import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/forms/contact-form";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AnimateIn } from "@/components/motion/animate-in";
import { PageHeader } from "@/components/sections/page-header";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return buildMetadata({ locale, title: t("titre"), description: t("texte"), path: "/contact" });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("titre")} intro={t("texte")} />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[1.6fr_1fr]">
        <AnimateIn className="rounded-card border border-primrose-ink/10 bg-primrose-white p-6 shadow-card md:p-8">
          <ContactForm />
        </AnimateIn>
        <AnimateIn delay={0.1} className="lg:self-start">
          <aside className="rounded-card bg-primrose-cream p-6 md:p-7">
            <ShieldCheck aria-hidden className="h-6 w-6 text-primrose-forest" />
            <h2 className="mt-4 font-serif text-xl text-primrose-ink">{t("aideTitre")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-primrose-ink/80">{t("aideTexte")}</p>
            <Link
              href="/besoin-d-aide"
              className="group mt-5 inline-flex items-center gap-2 rounded-full bg-primrose-alert px-5 py-2.5 text-sm font-semibold text-primrose-white transition-colors hover:bg-primrose-alert/90"
            >
              {t("aideLien")}
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </aside>
        </AnimateIn>
      </section>
    </>
  );
}
