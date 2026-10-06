import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  getReseauxSociaux,
  getParametresSite,
  getNumerosUrgence,
  isNumeroAppelable,
} from "@/lib/data/site-settings";
import { SocialIcon } from "@/components/icons/social-icon";

const linkClass =
"text-sm text-primrose-white/80 transition-colors hover:text-primrose-white hover:underline underline-offset-4";

export async function Footer() {
  const t = await getTranslations("footer");
  const [reseaux, parametres, numerosUrgence] = await Promise.all([
  getReseauxSociaux(),
  getParametresSite(),
  getNumerosUrgence(),
  ]);
  const numerosAppelables = numerosUrgence.filter((n) => isNumeroAppelable(n.numero));

  return (
  <footer className="bg-primrose-forest text-primrose-white">
  <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-12 pt-16 md:px-6 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-10">
  <div>
  <div className="flex items-center gap-4">
  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-primrose-white bg-primrose-white">
  <Image
  src="/primrose-logo.png"
  alt=""
  fill
  sizes="56px"
  className="object-cover [clip-path:circle(48%_at_50%_50%)]"
  />
  </span>
  <p className="font-serif text-xl leading-tight">
  Primrose
  <span className="block text-sm italic text-primrose-white/80">La Sororité Active</span>
  </p>
  </div>
  <p className="mt-5 max-w-xs text-sm leading-relaxed text-primrose-white/80">{t("description")}</p>

  {reseaux.length > 0 && (
  <>
  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-primrose-white/75">
  {t("suivre")}
  </p>
  <ul className="mt-3 flex flex-wrap items-center gap-3">
  {reseaux.map(({ plateforme, url }) => (
  <li key={plateforme}>
  <a
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={plateforme}
  className="block overflow-hidden rounded-full ring-2 ring-primrose-white/15 transition-transform"
  >
  <SocialIcon plateforme={plateforme} className="block h-9 w-9 overflow-hidden rounded-full" />
  </a>
  </li>
  ))}
  </ul>
  </>
  )}
  </div>

  <nav aria-labelledby="footer-association">
  <h2 id="footer-association" className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primrose-white/75">
  {t("association")}
  </h2>
  <ul className="mt-4 space-y-3">
  <li><Link href="/a-propos" className={linkClass}>{t("aPropos")}</Link></li>
  <li><Link href="/notre-mission" className={linkClass}>{t("notreMission")}</Link></li>
  <li><Link href="/actualites" className={linkClass}>{t("actualites")}</Link></li>
  <li><Link href="/evenements" className={linkClass}>{t("evenements")}</Link></li>
  </ul>
  </nav>

  <nav aria-labelledby="footer-agir">
  <h2 id="footer-agir" className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primrose-white/75">
  {t("agir")}
  </h2>
  <ul className="mt-4 space-y-3">
  <li><Link href="/rejoindre" className={linkClass}>{t("rejoindre")}</Link></li>
  <li><Link href="/formations" className={linkClass}>{t("formations")}</Link></li>
  <li><Link href="/contact" className={linkClass}>{t("contact")}</Link></li>
  {parametres?.email && (
  <li><a href={`mailto:${parametres.email}`} className={linkClass}>{parametres.email}</a></li>
  )}
  </ul>
  </nav>

  <div>
  <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primrose-white/75">
  {t("besoinDAide")}
  </h2>
  <Link
  href="/besoin-d-aide"
  className="group mt-4 inline-flex items-center gap-2 rounded-full bg-primrose-white px-5 py-2.5 text-sm font-semibold text-primrose-forest transition-transform duration-300"
  >
  {t("demanderAide")}
  <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300" />
  </Link>
  {numerosAppelables.length > 0 && (
  <ul className="mt-4 space-y-1 text-sm text-primrose-white/85">
  {numerosAppelables.map((n) => (
  <li key={n.label}>
  {n.label} :{" "}
  <a href={`tel:${n.numero.replace(/\s+/g, "")}`} className="font-semibold text-primrose-white underline underline-offset-4">
  {n.numero}
  </a>
  </li>
  ))}
  </ul>
  )}
  <p className="mt-4 text-xs leading-relaxed text-primrose-white/75">{t("quitter")}</p>
  </div>
  </div>

  <div className="border-t border-primrose-white/15">
  <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-primrose-white/75 md:flex-row md:items-center md:justify-between md:px-6">
  <p>© {new Date().getFullYear()} Primrose – La Sororité Active. {t("droits")}</p>
  <ul aria-label={t("legal")} className="flex flex-wrap gap-x-6 gap-y-2">
  <li><Link href="/mentions-legales" className="hover:text-primrose-white hover:underline underline-offset-4">{t("mentionsLegales")}</Link></li>
  <li><Link href="/politique-de-confidentialite" className="hover:text-primrose-white hover:underline underline-offset-4">{t("politiqueConfidentialite")}</Link></li>
  </ul>
  </div>
  </div>
  </footer>
  );
}
