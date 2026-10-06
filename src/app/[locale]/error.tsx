"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("erreurs");

  useEffect(() => {
  console.error(error);
  }, [error]);

  return (
  <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center md:px-6">
  <h1 className="font-serif text-2xl text-primrose-forest md:text-3xl">
  {t("500titre")}
  </h1>
  <p className="mt-2 text-primrose-ink/80">{t("500texte")}</p>
  <button
  type="button"
  onClick={reset}
  className="mt-6 rounded-full bg-primrose-forest px-6 py-3 text-sm font-medium text-primrose-white hover:bg-primrose-forest/90"
  >
  {t("500bouton")}
  </button>
  </section>
  );
}
