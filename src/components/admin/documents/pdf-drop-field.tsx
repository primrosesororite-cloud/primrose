"use client";

import { useRef, useState, type DragEvent } from "react";
import { toast } from "sonner";
import { FileText, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTaille } from "@/lib/format";
import { DOCUMENT_MAX_OCTETS } from "@/lib/validations/admin/documents";

/** Vérifie la signature « %PDF- » : l'extension seule ne prouve rien. */
async function estUnPdf(file: File) {
  const entete = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  return String.fromCharCode(...entete) === "%PDF-";
}

/**
 * Sélection d'un PDF (clic ou glisser-déposer). Le fichier n'est pas envoyé
 * ici : le formulaire parent l'envoie à l'enregistrement, ce qui évite des
 * fichiers orphelins dans le bucket si l'on annule.
 */
export function PdfDropField({
  file,
  onChange,
  fichierActuel,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  fichierActuel?: { url: string; taille: number | null };
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  async function accept(candidate: File | undefined) {
    if (!candidate) return;
    if (candidate.size > DOCUMENT_MAX_OCTETS) {
      toast.error("Fichier trop volumineux (20 Mo max). Pensez à le compresser.");
      return;
    }
    if (!(await estUnPdf(candidate))) {
      toast.error("Seuls les fichiers PDF sont acceptés.");
      return;
    }
    onChange(candidate);
  }

  function onDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragging(false);
    accept(event.dataTransfer.files[0]);
  }

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-primrose-green/50 bg-primrose-cream px-4 py-3">
        <FileText className="h-6 w-6 shrink-0 text-primrose-green-dark" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-primrose-ink">{file.name}</p>
          <p className="text-xs text-primrose-ink/70">{formatTaille(file.size)} · prêt à l&apos;envoi</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="Retirer le fichier"
          className="flex h-8 w-8 items-center justify-center rounded-full text-primrose-ink/60 hover:bg-primrose-white hover:text-primrose-ink"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed px-4 py-7 text-primrose-ink/70 transition-colors",
          dragging
            ? "border-primrose-green-dark bg-primrose-cream"
            : "border-primrose-ink/25 hover:border-primrose-green"
        )}
      >
        <UploadCloud className="h-6 w-6" aria-hidden />
        <span className="text-sm font-medium">
          {fichierActuel ? "Remplacer le PDF" : "Glissez un PDF ici ou cliquez pour choisir"}
        </span>
        <span className="text-xs">PDF uniquement · 20 Mo maximum</span>
      </button>
      {fichierActuel && (
        <p className="mt-2 text-xs text-primrose-ink/70">
          Fichier actuel :{" "}
          <a href={fichierActuel.url} target="_blank" rel="noopener noreferrer" className="underline">
            ouvrir le PDF
          </a>
          {fichierActuel.taille !== null && ` (${formatTaille(fichierActuel.taille)})`}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          accept(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
