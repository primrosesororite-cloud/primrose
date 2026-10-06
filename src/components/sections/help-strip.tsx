import { useTranslations } from "next-intl";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AnimateIn } from "@/components/motion/animate-in";

/** Accès direct et rassurant à l'aide, juste sous le héro. */
export function HelpStrip() {
  const t = useTranslations("home.aide");

  return (
  <div className="relative z-10 -mt-12 bg-primrose-cream px-4 md:px-6">
  <AnimateIn className="mx-auto max-w-4xl">
  <div className="flex flex-col gap-5 rounded-2xl border border-primrose-ink/10 bg-primrose-white p-6 shadow-[0_24px_50px_-28px_rgba(58,46,42,0.35)] md:flex-row md:items-center md:gap-6 md:p-7">
  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primrose-cream text-primrose-forest">
  <ShieldCheck aria-hidden className="h-6 w-6" />
  </span>
  <div className="flex-1">
  <h2 className="font-serif text-xl text-primrose-ink md:text-2xl">{t("titre")}</h2>
  <p className="mt-1 text-sm text-primrose-ink/80">{t("texte")}</p>
  <p className="mt-2 text-xs text-primrose-ink/70">{t("astuce")}</p>
  </div>
  <Link
  href="/besoin-d-aide"
  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primrose-alert px-5 py-3 text-sm font-semibold text-primrose-white transition-colors hover:bg-primrose-alert/90"
  >
  {t("lien")}
  <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300" />
  </Link>
  </div>
  </AnimateIn>
  </div>
  );
}
