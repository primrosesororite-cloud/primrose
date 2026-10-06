import type { Metadata } from "next";
import { Newsreader, Public_Sans } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AnalyticsProvider } from "@/components/layout/analytics-provider";
import { PublicShell } from "@/components/layout/public-shell";
import { MotionProvider } from "@/components/motion/motion-provider";
import { getSiteUrl } from "@/lib/seo";
import { organizationJsonLd } from "@/lib/json-ld";
import { getReseauxSociaux } from "@/lib/data/site-settings";
import "../globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * ISR par défaut pour tout le site public (le footer lit reseaux_sociaux /
 * parametres_site sur chaque page). Une route qui appelle une API dynamique
 * (cookies(), auth…) — tout /admin/* — reste automatiquement en rendu
 * dynamique malgré cette valeur : Next.js détecte l'usage dynamique par
 * route et l'emporte sur le `revalidate` du layout parent.
 */
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });

  return {
    metadataBase: new URL(getSiteUrl()),
    title: "Primrose – La Sororité Active",
    description: t("texte"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const reseaux = await getReseauxSociaux();

  return (
    <html
      lang={locale}
      className={`${newsreader.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-primrose-white text-primrose-ink">
        <script
          type="application/ld+json"
          // JSON-LD statique dérivé de données de confiance (réseaux sociaux
          // de l'association) : pas d'entrée utilisateur, injection sûre.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd(reseaux)),
          }}
        />
        <NextIntlClientProvider>
          <MotionProvider>
            <AnalyticsProvider />
            <PublicShell navbar={<Navbar />} footer={<Footer />}>
              {children}
            </PublicShell>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
