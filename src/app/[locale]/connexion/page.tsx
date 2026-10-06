import { setRequestLocale, getTranslations } from "next-intl/server";
import { ConnexionForm } from "@/components/forms/connexion-form";

export default async function ConnexionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <section className="mx-auto max-w-sm px-4 py-16 md:px-6">
      <h1 className="font-serif text-3xl text-primrose-forest">{t("titre")}</h1>
      <div className="mt-8">
        <ConnexionForm />
      </div>
    </section>
  );
}
