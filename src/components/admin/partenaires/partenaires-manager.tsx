"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { SortableList } from "@/components/admin/sortable-list";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { PartenaireCard } from "@/components/admin/partenaires/partenaire-card";
import { createPartenaire, reorderPartenaires } from "@/actions/admin/equipe";
import type { Database } from "@/types/database";

type Partenaire = Database["public"]["Tables"]["partenaires"]["Row"];

function AddPartenaireForm({ nextOrdre }: { nextOrdre: number }) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [nom, setNom] = useState("");
  const [lien, setLien] = useState("");

  async function handleAdd() {
    if (!nom.trim()) {
      toast.error("Le nom est requis.");
      return;
    }
    const fd = new FormData();
    fd.set("nom", nom);
    fd.set("lien", lien);
    const result = await createPartenaire(logoUrl, nextOrdre, fd);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Partenaire ajouté.");
      setNom("");
      setLien("");
      setLogoUrl(null);
    }
  }

  return (
    <div className="grid grid-cols-[96px_1fr_auto] items-center gap-4 rounded-card bg-primrose-cream p-4">
      <ImageUploadField value={logoUrl} onChange={setLogoUrl} folder="partenaires" />
      <div className="flex gap-2">
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom"
          className="min-w-0 flex-1 rounded-lg border border-primrose-ink/15 bg-primrose-white px-3 py-2 text-sm"
        />
        <input
          value={lien}
          onChange={(e) => setLien(e.target.value)}
          placeholder="Lien (https://…)"
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

export function PartenairesManager({ partenaires }: { partenaires: Partenaire[] }) {
  return (
    <div className="space-y-4">
      <AddPartenaireForm nextOrdre={partenaires.length + 1} />
      <SortableList
        items={partenaires}
        getId={(p) => p.id}
        onReorder={reorderPartenaires}
        renderItem={(partenaire) => <PartenaireCard partenaire={partenaire} />}
      />
    </div>
  );
}
