"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE, SPRING } from "@/lib/motion";
import { DocumentCard } from "@/components/documents/document-card";
import type { Database, DocumentCategorie } from "@/types/database";

type Document = Database["public"]["Tables"]["documents"]["Row"];

/** Filtre par catégorie : la pastille glisse d'un choix à l'autre et la grille se réorganise en douceur. */
export function DocumentsExplorer({ documents }: { documents: Document[] }) {
  const t = useTranslations("documents");
  const [filtre, setFiltre] = useState<DocumentCategorie | null>(null);

  const categories = [...new Set(documents.map((d) => d.categorie))];
  const visibles = filtre ? documents.filter((d) => d.categorie === filtre) : documents;
  const choix: (DocumentCategorie | null)[] = [null, ...categories];

  return (
    <div>
      {categories.length > 1 && (
        <LayoutGroup id="documents-filtre">
          <div role="group" aria-label={t("filtre")} className="flex flex-wrap gap-2">
            {choix.map((categorie) => {
              const actif = filtre === categorie;
              return (
                <button
                  key={categorie ?? "toutes"}
                  type="button"
                  aria-pressed={actif}
                  onClick={() => setFiltre(categorie)}
                  className={cn(
                    "relative isolate rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                    actif
                      ? "border-primrose-forest text-primrose-white"
                      : "border-primrose-forest/25 text-primrose-forest hover:bg-primrose-white"
                  )}
                >
                  {actif && (
                    <motion.span
                      layoutId="documents-filtre-pastille"
                      transition={SPRING}
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-full bg-primrose-forest"
                    />
                  )}
                  {categorie ? t(`categories.${categorie}`) : t("toutes")}
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      )}

      <motion.ul layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visibles.map((document) => (
            <motion.li
              key={document.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <DocumentCard document={document} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
