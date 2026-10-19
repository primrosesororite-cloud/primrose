/**
 * Chargement paresseux de pdf.js (build « legacy » : compatible avec les
 * navigateurs Android plus anciens, fréquents chez notre public). Le module
 * (~400 Ko) n'est téléchargé que sur une page de lecture de document.
 */
export type PdfJs = typeof import("pdfjs-dist/legacy/build/pdf.mjs");

let pdfjsPromise: Promise<PdfJs> | null = null;

export function loadPdfJs(): Promise<PdfJs> {
  pdfjsPromise ??= import("pdfjs-dist/legacy/build/pdf.mjs").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
    return pdfjs;
  });
  return pdfjsPromise;
}
