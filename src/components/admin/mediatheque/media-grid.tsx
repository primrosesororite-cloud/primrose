"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Pencil, Check, Copy } from "lucide-react";
import { RowActions } from "@/components/admin/row-actions";
import { updateMediaAlt, deleteMedia } from "@/actions/admin/medias";
import type { Database } from "@/types/database";

type Media = Database["public"]["Tables"]["medias"]["Row"];

function MediaCard({ media }: { media: Media }) {
  const [editing, setEditing] = useState(false);
  const [alt, setAlt] = useState(media.alt);

  async function saveAlt() {
  const fd = new FormData();
  fd.set("alt", alt);
  const result = await updateMediaAlt(media.id, fd);
  if (result?.error) toast.error(result.error);
  else setEditing(false);
  }

  function copyUrl() {
  navigator.clipboard.writeText(media.url);
  toast.success("URL copiée.");
  }

  return (
  <div className="overflow-hidden rounded-card bg-primrose-white shadow-card">
  <div className="relative h-32 w-full bg-primrose-cream">
  <Image src={media.url} alt={media.alt} fill className="object-cover" sizes="200px" />
  </div>
  <div className="p-3">
  {editing ? (
  <div className="flex items-center gap-1">
  <input
  value={alt}
  onChange={(e) => setAlt(e.target.value)}
  className="min-w-0 flex-1 rounded border border-primrose-ink/15 px-2 py-1 text-xs"
  autoFocus
  />
  <button type="button" onClick={saveAlt} aria-label="Valider" className="text-primrose-green-dark">
  <Check className="h-3.5 w-3.5" aria-hidden />
  </button>
  </div>
  ) : (
  <div className="flex items-start justify-between gap-1">
  <p className="min-w-0 flex-1 truncate text-xs text-primrose-ink/70" title={media.alt}>
  {media.alt}
  </p>
  <button
  type="button"
  onClick={() => setEditing(true)}
  aria-label="Modifier le texte alternatif"
  className="shrink-0 text-primrose-ink/40 hover:text-primrose-ink"
  >
  <Pencil className="h-3 w-3" aria-hidden />
  </button>
  </div>
  )}

  <div className="mt-2 flex items-center justify-between">
  <button
  type="button"
  onClick={copyUrl}
  className="inline-flex items-center gap-1 text-xs text-primrose-ink/70 hover:text-primrose-ink"
  >
  <Copy className="h-3 w-3" aria-hidden />
  Copier l&apos;URL
  </button>
  <RowActions
  itemLabel={media.alt}
  onDelete={() => deleteMedia(media.id, media.chemin)}
  />
  </div>
  </div>
  </div>
  );
}

export function MediaGrid({ medias }: { medias: Media[] }) {
  const [search, setSearch] = useState("");
  const filtered = medias.filter((m) =>
  m.alt.toLowerCase().includes(search.toLowerCase())
  );

  if (medias.length === 0) {
  return (
  <p className="rounded-card bg-primrose-cream p-6 text-center text-sm text-primrose-ink/70">
  Aucune image dans la médiathèque pour le moment.
  </p>
  );
  }

  return (
  <div>
  <input
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Rechercher par texte alternatif…"
  className="w-full max-w-xs rounded-lg border border-primrose-ink/15 bg-primrose-white px-3 py-2 text-sm"
  />
  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
  {filtered.map((media) => (
  <MediaCard key={media.id} media={media} />
  ))}
  </div>
  </div>
  );
}
