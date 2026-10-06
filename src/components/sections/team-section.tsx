import Image from "next/image";
import { useTranslations } from "next-intl";
import { User } from "lucide-react";
import { AnimateIn } from "@/components/motion/animate-in";
import { staggerContainer } from "@/lib/motion";
import { SectionHeading } from "@/components/sections/section-heading";
import type { Database } from "@/types/database";

type Membre = Database["public"]["Tables"]["equipe"]["Row"];

export function TeamSection({ membres }: { membres: Membre[] }) {
  const t = useTranslations("aPropos");

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading title={t("equipeTitre")} align="center" />

      {membres.length === 0 ? (
        <p className="mx-auto mt-6 max-w-md text-center text-primrose-ink/75">
          {t("equipeAVenir")}
        </p>
      ) : (
        <AnimateIn variants={staggerContainer} className="mt-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {membres.map((membre) => (
              <AnimateIn key={membre.id}>
                <article className="flex flex-col items-center rounded-card bg-primrose-white p-6 text-center shadow-card">
                  <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primrose-green/15 text-primrose-forest">
                    {membre.photo_url ? (
                      <Image
                        src={membre.photo_url}
                        alt={membre.nom}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <User aria-hidden className="h-8 w-8" />
                    )}
                  </div>
                  <p className="mt-3 font-serif text-lg text-primrose-forest">{membre.nom}</p>
                  {membre.fonction && (
                    <p className="text-sm text-primrose-ink/70">{membre.fonction}</p>
                  )}
                  {membre.bio && (
                    <p className="mt-2 text-xs text-primrose-ink/75">{membre.bio}</p>
                  )}
                </article>
              </AnimateIn>
            ))}
          </div>
        </AnimateIn>
      )}
    </section>
  );
}
