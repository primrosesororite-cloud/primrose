"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { PDFDocumentProxy, RenderTask, TextLayer } from "pdfjs-dist/legacy/build/pdf.mjs";
import type { PdfJs } from "@/lib/pdfjs";
import { cn } from "@/lib/utils";

/** Densité de pixels plafonnée : au-delà, la mémoire explose sur mobile pour un gain invisible. */
const MAX_OUTPUT_SCALE = 2;

/**
 * Une page du PDF. Elle n'est dessinée qu'à l'approche du viewport et son
 * canvas est libéré quand elle s'en éloigne : un rapport de 80 pages reste
 * fluide sur un téléphone d'entrée de gamme.
 */
export function PdfPage({
  pdfjs,
  pdf,
  numero,
  largeur,
  ratioParDefaut,
  label,
  pageRef,
}: {
  pdfjs: PdfJs;
  pdf: PDFDocumentProxy;
  numero: number;
  largeur: number;
  ratioParDefaut: number;
  label: string;
  pageRef: (el: HTMLDivElement | null) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [proche, setProche] = useState(false);
  const [rendue, setRendue] = useState(false);
  const [largeurPoints, setLargeurPoints] = useState<number | null>(null);
  const [ratio, setRatio] = useState(ratioParDefaut);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setProche(entry.isIntersecting);
        if (!entry.isIntersecting && canvasRef.current) {
          canvasRef.current.width = 0;
          canvasRef.current.height = 0;
          textRef.current?.replaceChildren();
          setRendue(false);
        }
      },
      { rootMargin: "800px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!proche || largeur <= 0) return;
    let annule = false;
    let renderTask: RenderTask | null = null;
    let textLayer: TextLayer | null = null;

    (async () => {
      const page = await pdf.getPage(numero);
      if (annule || !canvasRef.current || !textRef.current) return;

      const base = page.getViewport({ scale: 1 });
      setLargeurPoints(base.width);
      setRatio(base.height / base.width);

      const viewport = page.getViewport({ scale: largeur / base.width });
      const outputScale = Math.min(window.devicePixelRatio || 1, MAX_OUTPUT_SCALE);
      const canvas = canvasRef.current;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);

      renderTask = page.render({
        canvas,
        viewport,
        transform: outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0],
      });
      await renderTask.promise;
      if (annule) return;
      setRendue(true);

      // Calque de texte transparent : sélection, copie et lecteurs d'écran.
      textRef.current.replaceChildren();
      textLayer = new pdfjs.TextLayer({
        textContentSource: page.streamTextContent(),
        container: textRef.current,
        viewport,
      });
      await textLayer.render();
    })().catch(() => {
      // Rendu annulé (défilement, zoom) ou page illisible : le gabarit reste affiché.
    });

    return () => {
      annule = true;
      renderTask?.cancel();
      textLayer?.cancel();
    };
  }, [proche, largeur, numero, pdf, pdfjs]);

  const style = {
    width: largeur,
    height: Math.round(largeur * ratio),
    "--total-scale-factor": largeurPoints ? largeur / largeurPoints : 1,
  } as CSSProperties;

  return (
    <div
      ref={(el) => {
        wrapperRef.current = el;
        pageRef(el);
      }}
      role="group"
      aria-label={label}
      style={style}
      className="relative mx-auto shrink-0 scroll-mt-40 overflow-hidden rounded-md bg-primrose-white shadow-card"
    >
      {!rendue && (
        <div aria-hidden className="absolute inset-0 bg-primrose-cream/60 motion-safe:animate-pulse" />
      )}
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          "absolute inset-0 h-full w-full transition-opacity duration-500",
          rendue ? "opacity-100" : "opacity-0"
        )}
      />
      <div ref={textRef} className="textLayer" />
    </div>
  );
}
