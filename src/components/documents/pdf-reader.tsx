"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Minus,
  Plus,
  MoveHorizontal,
  FileWarning,
} from "lucide-react";
import type { PDFDocumentProxy } from "pdfjs-dist/legacy/build/pdf.mjs";
import { loadPdfJs, type PdfJs } from "@/lib/pdfjs";
import { fadeUp } from "@/lib/motion";
import { PdfPage } from "@/components/documents/pdf-page";

const ZOOMS = [0.75, 1, 1.25, 1.5, 2] as const;
const ZOOM_INITIAL = 1;
const LARGEUR_MAX = 880;
const ESPACEMENT = 32;

const toolButton =
  "flex h-9 w-9 items-center justify-center rounded-full text-primrose-forest transition-colors hover:bg-primrose-cream disabled:pointer-events-none disabled:opacity-35";

export function PdfReader({
  url,
  titre,
  urlTelechargement,
}: {
  url: string;
  titre: string;
  urlTelechargement: string;
}) {
  const t = useTranslations("documents.lecteur");
  const tDoc = useTranslations("documents");
  const shouldReduceMotion = useReducedMotion();

  const [etat, setEtat] = useState<"chargement" | "pret" | "erreur">("chargement");
  const [lib, setLib] = useState<{ pdfjs: PdfJs; pdf: PDFDocumentProxy; ratio: number } | null>(null);
  const [largeurConteneur, setLargeurConteneur] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(ZOOM_INITIAL);
  const [pageCourante, setPageCourante] = useState(1);
  const conteneurRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let annule = false;
    let destroy: (() => void) | null = null;

    loadPdfJs()
      .then(async (pdfjs) => {
        // Chargement par plages : seules les pages lues sont téléchargées,
        // essentiel sur les connexions lentes.
        const task = pdfjs.getDocument({ url, disableAutoFetch: true });
        destroy = () => void task.destroy();
        const pdf = await task.promise;
        const premiere = (await pdf.getPage(1)).getViewport({ scale: 1 });
        if (annule) return;
        setLib({ pdfjs, pdf, ratio: premiere.height / premiere.width });
        setEtat("pret");
      })
      .catch(() => {
        if (!annule) setEtat("erreur");
      });

    return () => {
      annule = true;
      destroy?.();
    };
  }, [url]);

  useEffect(() => {
    const el = conteneurRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setLargeurConteneur(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Page courante = celle qui traverse le milieu de l'écran. L'observateur
  // est branché dans la ref de chaque page : avec AnimatePresence « wait »,
  // les pages sont montées après la fin de l'animation de chargement.
  const pageObserverRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => () => pageObserverRef.current?.disconnect(), []);

  function enregistrerPage(index: number, el: HTMLDivElement | null) {
    pageObserverRef.current ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const position = pagesRef.current.indexOf(entry.target as HTMLDivElement);
          if (position >= 0) setPageCourante(position + 1);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    const precedent = pagesRef.current[index];
    if (precedent && precedent !== el) pageObserverRef.current.unobserve(precedent);
    pagesRef.current[index] = el;
    if (el) pageObserverRef.current.observe(el);
  }

  const nbPages = lib?.pdf.numPages ?? 0;
  const largeurBase = Math.max(0, Math.min(largeurConteneur - ESPACEMENT, LARGEUR_MAX));
  const largeurPage = Math.floor(largeurBase * ZOOMS[zoomIndex]);

  function allerA(numero: number) {
    const cible = Math.min(Math.max(numero, 1), nbPages);
    pagesRef.current[cible - 1]?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <section aria-label={t("region", { titre })} className="overflow-clip rounded-card bg-primrose-cream">
      <div className="sticky top-[4.5rem] z-30 flex flex-wrap items-center justify-between gap-2 border-b border-primrose-green/30 bg-primrose-white/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-primrose-white/80 sm:px-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={toolButton}
            onClick={() => allerA(pageCourante - 1)}
            disabled={etat !== "pret" || pageCourante <= 1}
            aria-label={t("precedente")}
          >
            <ChevronLeft aria-hidden className="h-5 w-5" />
          </button>
          <p aria-live="polite" className="min-w-[7.5rem] text-center text-sm font-medium tabular-nums text-primrose-ink">
            {etat === "pret" ? t("page", { current: pageCourante, total: nbPages }) : "—"}
          </p>
          <button
            type="button"
            className={toolButton}
            onClick={() => allerA(pageCourante + 1)}
            disabled={etat !== "pret" || pageCourante >= nbPages}
            aria-label={t("suivante")}
          >
            <ChevronRight aria-hidden className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className={toolButton}
            onClick={() => setZoomIndex((z) => z - 1)}
            disabled={etat !== "pret" || zoomIndex === 0}
            aria-label={t("zoomMoins")}
          >
            <Minus aria-hidden className="h-4 w-4" />
          </button>
          <span className="hidden w-12 text-center text-xs font-semibold tabular-nums text-primrose-ink/80 sm:inline">
            {Math.round(ZOOMS[zoomIndex] * 100)}&nbsp;%
          </span>
          <button
            type="button"
            className={toolButton}
            onClick={() => setZoomIndex((z) => z + 1)}
            disabled={etat !== "pret" || zoomIndex === ZOOMS.length - 1}
            aria-label={t("zoomPlus")}
          >
            <Plus aria-hidden className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={toolButton}
            onClick={() => setZoomIndex(ZOOM_INITIAL)}
            disabled={etat !== "pret" || zoomIndex === ZOOM_INITIAL}
            aria-label={t("zoomReset")}
          >
            <MoveHorizontal aria-hidden className="h-4 w-4" />
          </button>
          <a
            href={urlTelechargement}
            className="ml-1 inline-flex h-9 items-center gap-1.5 rounded-full bg-primrose-forest px-3.5 text-sm font-semibold text-primrose-white transition-[background-color,transform] hover:bg-primrose-forest/90 active:scale-[0.97] sm:px-4"
          >
            <Download aria-hidden className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">{tDoc("telecharger")}</span>
          </a>
        </div>
      </div>

      <div ref={conteneurRef} className="overflow-x-auto">
        <AnimatePresence mode="wait" initial={false}>
          {etat === "chargement" && (
            <motion.div
              key="chargement"
              exit={{ opacity: 0 }}
              className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-primrose-ink/75"
            >
              <Loader2 aria-hidden className="h-7 w-7 text-primrose-forest motion-safe:animate-spin" />
              <p role="status" className="text-sm">{t("chargement")}</p>
            </motion.div>
          )}

          {etat === "erreur" && (
            <motion.div
              key="erreur"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center"
            >
              <FileWarning aria-hidden className="h-9 w-9 text-primrose-forest" />
              <p role="alert" className="max-w-md text-primrose-ink/85">{t("erreur")}</p>
              <a
                href={urlTelechargement}
                className="inline-flex items-center gap-2 rounded-full bg-primrose-forest px-5 py-2.5 text-sm font-semibold text-primrose-white hover:bg-primrose-forest/90"
              >
                <Download aria-hidden className="h-4 w-4" />
                {tDoc("telecharger")}
              </a>
            </motion.div>
          )}

          {etat === "pret" && lib && (
            <motion.div
              key="pages"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex w-max min-w-full flex-col gap-6 px-4 py-6 md:py-10"
            >
              {Array.from({ length: nbPages }, (_, index) => (
                <PdfPage
                  key={index}
                  pdfjs={lib.pdfjs}
                  pdf={lib.pdf}
                  numero={index + 1}
                  largeur={largeurPage}
                  ratioParDefaut={lib.ratio}
                  label={t("pageAlt", { numero: index + 1 })}
                  pageRef={(el) => enregistrerPage(index, el)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
