import { createClient } from "@/lib/supabase/server";
import { MediaUploadDialog } from "@/components/admin/mediatheque/media-upload-dialog";
import { MediaGrid } from "@/components/admin/mediatheque/media-grid";

export default async function AdminMediathequePage() {
  const supabase = await createClient();
  const { data: medias } = await supabase
    .from("medias")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-primrose-green-dark">Médiathèque</h1>
          <p className="mt-1 text-sm text-primrose-ink/70">
            Images compressées automatiquement (WebP) à l&apos;envoi. Le texte
            alternatif est obligatoire.
          </p>
        </div>
        <MediaUploadDialog />
      </div>
      <div className="mt-6">
        <MediaGrid medias={medias ?? []} />
      </div>
    </div>
  );
}
