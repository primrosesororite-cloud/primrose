"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/image-compress";

/**
 * Upload d'image vers le bucket public `images-public`, avec compression
 * côté client (canvas → WebP) avant envoi. L'alt text est un champ séparé
 * fourni par l'appelant, jamais optionnel côté formulaire parent.
 */
export function ImageUploadField({
  value,
  onChange,
  folder,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const blob = await compressImage(file);
      const path = `${folder}/${crypto.randomUUID()}.webp`;
      const supabase = createClient();
      const { error } = await supabase.storage
        .from("images-public")
        .upload(path, blob, { contentType: "image/webp" });

      if (error) throw error;

      const { data } = supabase.storage.from("images-public").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch {
      toast.error("L'envoi de l'image a échoué.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative h-32 w-full overflow-hidden rounded-lg bg-primrose-cream">
          <Image src={value} alt="" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Retirer l'image"
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primrose-ink/70 text-primrose-white hover:bg-primrose-ink"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-32 w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-primrose-ink/25 text-primrose-ink/60 hover:border-primrose-green disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          ) : (
            <Upload className="h-5 w-5" aria-hidden />
          )}
          <span className="text-xs">{uploading ? "Envoi…" : "Choisir une image"}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
