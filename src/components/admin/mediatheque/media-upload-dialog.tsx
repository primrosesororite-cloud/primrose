"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Modal } from "@/components/admin/modal";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/image-compress";
import { mediaAltSchema } from "@/lib/validations/admin/medias";
import { recordMedia } from "@/actions/admin/medias";

type FormValues = { alt: string };

export function MediaUploadDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(mediaAltSchema), defaultValues: { alt: "" } });

  function close() {
    setOpen(false);
    setFile(null);
    reset();
  }

  async function onSubmit(values: FormValues) {
    if (!file) {
      toast.error("Choisissez une image.");
      return;
    }
    setUploading(true);
    try {
      const blob = await compressImage(file);
      const chemin = `mediatheque/${crypto.randomUUID()}.webp`;
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from("images-public")
        .upload(chemin, blob, { contentType: "image/webp" });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("images-public").getPublicUrl(chemin);

      const fd = new FormData();
      fd.set("url", data.publicUrl);
      fd.set("chemin", chemin);
      fd.set("alt", values.alt);
      fd.set("tailleOctets", String(blob.size));

      const result = await recordMedia(fd);
      if (result?.error) toast.error(result.error);
      else {
        toast.success("Image ajoutée à la médiathèque.");
        close();
      }
    } catch {
      toast.error("L'envoi de l'image a échoué.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-primrose-green-dark px-4 py-2 text-sm font-medium text-primrose-white hover:bg-primrose-green-dark/90"
      >
        <Plus className="h-4 w-4" aria-hidden />
        Ajouter une image
      </button>

      <Modal open={open} onOpenChange={(o) => (o ? setOpen(true) : close())} title="Ajouter une image">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-primrose-ink">Fichier</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-primrose-ink">
              Texte alternatif (obligatoire)
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
              placeholder="Décrit l'image pour les lecteurs d'écran"
              {...register("alt")}
            />
            {errors.alt && (
              <p className="mt-1 text-xs text-primrose-alert">{errors.alt.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="rounded-full bg-primrose-green-dark px-5 py-2.5 text-sm font-medium text-primrose-white hover:bg-primrose-green-dark/90 disabled:opacity-60"
          >
            {uploading ? "Envoi…" : "Ajouter"}
          </button>
        </form>
      </Modal>
    </>
  );
}
