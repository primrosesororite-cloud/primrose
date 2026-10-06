import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("erreurs");

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center md:px-6">
      <p className="font-serif text-6xl text-primrose-forest/70">404</p>
      <h1 className="mt-4 font-serif text-2xl text-primrose-forest md:text-3xl">
        {t("404titre")}
      </h1>
      <p className="mt-2 text-primrose-ink/80">{t("404texte")}</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-primrose-forest px-6 py-3 text-sm font-medium text-primrose-white hover:bg-primrose-forest/90"
      >
        {t("404bouton")}
      </Link>
    </section>
  );
}
