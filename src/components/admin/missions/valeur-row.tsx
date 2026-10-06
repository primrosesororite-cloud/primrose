"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { updateValeur, deleteValeur } from "@/actions/admin/missions";
import type { Database } from "@/types/database";

type Valeur = Database["public"]["Tables"]["valeurs"]["Row"];

export function ValeurRow({ valeur }: { valeur: Valeur }) {
  const [editing, setEditing] = useState(false);
  const [libelle, setLibelle] = useState(valeur.libelle);

  async function save() {
  const fd = new FormData();
  fd.set("libelle", libelle);
  const result = await updateValeur(valeur.id, fd);
  if (result?.error) toast.error(result.error);
  else setEditing(false);
  }

  async function remove() {
  const result = await deleteValeur(valeur.id);
  if (result?.error) toast.error(result.error);
  }

  if (editing) {
  return (
  <div className="flex items-center gap-1">
  <input
  value={libelle}
  onChange={(e) => setLibelle(e.target.value)}
  className="rounded-full border border-primrose-ink/15 px-2 py-1 text-xs"
  autoFocus
  />
  <button type="button" onClick={save} aria-label="Valider" className="text-primrose-green-dark">
  <Check className="h-3.5 w-3.5" aria-hidden />
  </button>
  <button
  type="button"
  onClick={() => {
  setLibelle(valeur.libelle);
  setEditing(false);
  }}
  aria-label="Annuler"
  className="text-primrose-ink/70"
  >
  <X className="h-3.5 w-3.5" aria-hidden />
  </button>
  </div>
  );
  }

  return (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-primrose-cream px-3 py-1 text-xs font-medium text-primrose-green-dark">
  {valeur.libelle}
  <button type="button" onClick={() => setEditing(true)} aria-label="Modifier" className="opacity-60 hover:opacity-100">
  <Pencil className="h-3 w-3" aria-hidden />
  </button>
  <button type="button" onClick={remove} aria-label="Supprimer" className="opacity-60 hover:opacity-100 hover:text-primrose-alert">
  <Trash2 className="h-3 w-3" aria-hidden />
  </button>
  </span>
  );
}
