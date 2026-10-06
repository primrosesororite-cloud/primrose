"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { updateNumerosUrgence } from "@/actions/admin/parametres";

type Numero = { label: string; numero: string };

export function NumerosUrgenceEditor({ initial }: { initial: Numero[] }) {
  const [numeros, setNumeros] = useState<Numero[]>(initial);
  const [saving, setSaving] = useState(false);

  function update(index: number, field: keyof Numero, value: string) {
    setNumeros((prev) => prev.map((n, i) => (i === index ? { ...n, [field]: value } : n)));
  }

  function remove(index: number) {
    setNumeros((prev) => prev.filter((_, i) => i !== index));
  }

  function add() {
    setNumeros((prev) => [...prev, { label: "", numero: "" }]);
  }

  async function save() {
    setSaving(true);
    const cleaned = numeros.filter((n) => n.label.trim() && n.numero.trim());
    const result = await updateNumerosUrgence(cleaned);
    setSaving(false);
    if (result?.error) toast.error(result.error);
    else {
      setNumeros(cleaned);
      toast.success("Numéros d'urgence mis à jour.");
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-primrose-ink/60">
        Affichés en bonne place sur /besoin-d-aide. Vérifiez chaque numéro
        avant publication — une information erronée sur cette page peut
        mettre quelqu&apos;un en danger.
      </p>
      {numeros.map((n, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={n.label}
            onChange={(e) => update(i, "label", e.target.value)}
            placeholder="Libellé (ex. Police secours)"
            className="min-w-0 flex-1 rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
          />
          <input
            value={n.numero}
            onChange={(e) => update(i, "numero", e.target.value)}
            placeholder="Numéro"
            className="w-40 rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label="Retirer"
            className="flex h-8 w-8 items-center justify-center rounded-full text-primrose-alert/70 hover:bg-primrose-alert/10"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-full border border-primrose-ink/15 px-3 py-1.5 text-xs font-medium text-primrose-ink hover:bg-primrose-cream"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Ajouter un numéro
        </button>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-primrose-green-dark px-4 py-1.5 text-xs font-medium text-primrose-white hover:bg-primrose-green-dark/90 disabled:opacity-60"
        >
          {saving ? "Enregistrement…" : "Enregistrer les numéros"}
        </button>
      </div>
    </div>
  );
}
