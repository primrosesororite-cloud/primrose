"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AdminDataTable } from "@/components/admin/data-table";
import { createAdminColumnHelper } from "@/components/admin/table-features";
import { RowActions } from "@/components/admin/row-actions";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { Modal } from "@/components/admin/modal";
import { reseauSocialSchema, type ReseauSocialInput } from "@/lib/validations/admin/equipe";
import {
  createReseauSocial,
  updateReseauSocial,
  deleteReseauSocial,
  toggleReseauSocialActif,
} from "@/actions/admin/equipe";
import type { Database, Plateforme } from "@/types/database";

type ReseauSocial = Database["public"]["Tables"]["reseaux_sociaux"]["Row"];

const helper = createAdminColumnHelper<ReseauSocial>();

const PLATEFORMES: Plateforme[] = [
"instagram",
"x",
"facebook",
"youtube",
"tiktok",
"whatsapp",
"linkedin",
];

function ReseauForm({ reseau, onSaved }: { reseau?: ReseauSocial; onSaved: () => void }) {
  const {
  register,
  handleSubmit,
  formState: { isSubmitting, errors },
  } = useForm<ReseauSocialInput>({
  resolver: zodResolver(reseauSocialSchema),
  defaultValues: reseau
  ? { plateforme: reseau.plateforme, url: reseau.url }
  : { plateforme: "instagram", url: "" },
  });

  async function onSubmit(values: ReseauSocialInput) {
  const fd = new FormData();
  fd.set("plateforme", values.plateforme);
  fd.set("url", values.url);
  const result = reseau
  ? await updateReseauSocial(reseau.id, fd)
  : await createReseauSocial(fd);
  if (result?.error) toast.error(result.error);
  else {
  toast.success(reseau ? "Réseau mis à jour." : "Réseau ajouté.");
  onSaved();
  }
  }

  return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  <div>
  <label className="text-sm font-medium text-primrose-ink">Plateforme</label>
  <select
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("plateforme")}
  >
  {PLATEFORMES.map((p) => (
  <option key={p} value={p}>
  {p}
  </option>
  ))}
  </select>
  </div>
  <div>
  <label className="text-sm font-medium text-primrose-ink">URL</label>
  <input
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 px-3 py-2 text-sm"
  {...register("url")}
  />
  {errors.url && <p className="mt-1 text-xs text-primrose-alert">URL invalide.</p>}
  </div>
  <button
  type="submit"
  disabled={isSubmitting}
  className="rounded-full bg-primrose-green-dark px-5 py-2.5 text-sm font-medium text-primrose-white hover:bg-primrose-green-dark/90 disabled:opacity-60"
  >
  {isSubmitting ? "Enregistrement…" : "Enregistrer"}
  </button>
  </form>
  );
}

export function ReseauxTable({ reseaux }: { reseaux: ReseauSocial[] }) {
  const [editing, setEditing] = useState<ReseauSocial | null>(null);
  const [creating, setCreating] = useState(false);

  const columns = [
  helper.accessor("plateforme", { header: "Plateforme" }),
  helper.accessor("url", { header: "URL" }),
  helper.display({
  id: "actif",
  header: "Statut",
  cell: ({ row }) => (
  <ToggleSwitch
  checked={row.original.actif}
  onToggle={(next) => toggleReseauSocialActif(row.original.id, next)}
  />
  ),
  }),
  helper.display({
  id: "actions",
  header: "",
  cell: ({ row }) => (
  <RowActions
  itemLabel={row.original.plateforme}
  onEdit={() => setEditing(row.original)}
  onDelete={() => deleteReseauSocial(row.original.id)}
  />
  ),
  }),
  ];

  return (
  <div>
  <div className="flex justify-end">
  <button
  type="button"
  onClick={() => setCreating(true)}
  className="rounded-full bg-primrose-green-dark px-4 py-2 text-sm font-medium text-primrose-white hover:bg-primrose-green-dark/90"
  >
  + Ajouter un réseau
  </button>
  </div>
  <div className="mt-4">
  <AdminDataTable data={reseaux} columns={columns} searchPlaceholder="Rechercher…" />
  </div>

  <Modal open={creating} onOpenChange={setCreating} title="Nouveau réseau social">
  <ReseauForm onSaved={() => setCreating(false)} />
  </Modal>
  <Modal open={!!editing} onOpenChange={(open) => !open && setEditing(null)} title="Modifier le réseau">
  {editing && <ReseauForm reseau={editing} onSaved={() => setEditing(null)} />}
  </Modal>
  </div>
  );
}
