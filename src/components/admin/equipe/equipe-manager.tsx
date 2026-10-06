"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { SortableList } from "@/components/admin/sortable-list";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { EquipeCard } from "@/components/admin/equipe/equipe-card";
import { createMembreEquipe, reorderEquipe } from "@/actions/admin/equipe";
import type { Database } from "@/types/database";

type Membre = Database["public"]["Tables"]["equipe"]["Row"];

function AddMembreForm({ nextOrdre }: { nextOrdre: number }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [nom, setNom] = useState("");
  const [fonction, setFonction] = useState("");

  async function handleAdd() {
    if (!nom.trim()) {
      toast.error("Le nom est requis.");
      return;
    }
    const fd = new FormData();
    fd.set("nom", nom);
    fd.set("fonction", fonction);
    fd.set("bio", "");
    const result = await createMembreEquipe(photoUrl, nextOrdre, fd);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Membre ajouté.");
      setNom("");
      setFonction("");
      setPhotoUrl(null);
    }
  }

  return (
    <div className="grid grid-cols-[96px_1fr_auto] items-center gap-4 rounded-card bg-primrose-cream p-4">
      <ImageUploadField value={photoUrl} onChange={setPhotoUrl} folder="equipe" />
      <div className="flex gap-2">
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom"
          className="min-w-0 flex-1 rounded-lg border border-primrose-ink/15 bg-primrose-white px-3 py-2 text-sm"
        />
        <input
          value={fonction}
          onChange={(e) => setFonction(e.target.value)}
          placeholder="Fonction"
          className="min-w-0 flex-1 rounded-lg border border-primrose-ink/15 bg-primrose-white px-3 py-2 text-sm"
        />
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primrose-green-dark text-primrose-white"
        aria-label="Ajouter"
      >
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

export function EquipeManager({ membres }: { membres: Membre[] }) {
  return (
    <div className="space-y-4">
      <AddMembreForm nextOrdre={membres.length + 1} />
      <SortableList
        items={membres}
        getId={(m) => m.id}
        onReorder={reorderEquipe}
        renderItem={(membre) => <EquipeCard membre={membre} />}
      />
    </div>
  );
}
