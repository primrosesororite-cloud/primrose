import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AnimateIn } from "@/components/motion/animate-in";
import { StaggerItem } from "@/components/motion/stagger-item";
import { scaleIn, stagger } from "@/lib/motion";
import { SectionHeading } from "@/components/sections/section-heading";
import { DocumentCard } from "@/components/documents/document-card";
import type { Database } from "@/types/database";

type Document = Database["public"]["Tables"]["documents"]["Row"];

export function LatestDocuments({ documents }: { documents: Document[] }) {
  const t = useTranslations("home.documents");

  if (documents.length === 0) return null;

  return (
    <section className="bg-primrose-white px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <AnimateIn className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow={t("eyebrow")} title={t("titre")} text={t("texte")} />
          <Link
            href="/documents"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primrose-forest"
          >
            {t("tout")}
            <ArrowRight
              aria-hidden
              className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1"
            />
          </Link>
        </AnimateIn>

        <AnimateIn variants={stagger} className="mt-10">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((document) => (
              <li key={document.id}>
                <StaggerItem variants={scaleIn} className="h-full">
                  <DocumentCard document={document} />
                </StaggerItem>
              </li>
            ))}
          </ul>
        </AnimateIn>
      </div>
    </section>
  );
}
