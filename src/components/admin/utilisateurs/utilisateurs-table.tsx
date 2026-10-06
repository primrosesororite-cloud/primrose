"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { AdminDataTable } from "@/components/admin/data-table";
import { createAdminColumnHelper } from "@/components/admin/table-features";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { updateUtilisateurRole, toggleUtilisateurActif } from "@/actions/admin/utilisateurs";
import type { UserRole } from "@/types/database";

type Utilisateur = {
  id: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  email: string;
};

const helper = createAdminColumnHelper<Utilisateur>();

const ROLES: UserRole[] = ["editor", "admin", "super_admin"];
const ROLE_LABELS: Record<UserRole, string> = {
  editor: "Éditeur",
  admin: "Admin",
  super_admin: "Super admin",
};

function RoleSelect({ locale, utilisateur }: { locale: string; utilisateur: Utilisateur }) {
  const [isPending, startTransition] = useTransition();

  function onChange(role: UserRole) {
    startTransition(async () => {
      const result = await updateUtilisateurRole(locale, utilisateur.id, role);
      if (result?.error) toast.error(result.error);
      else toast.success("Rôle mis à jour.");
    });
  }

  return (
    <select
      value={utilisateur.role}
      disabled={isPending}
      onChange={(e) => onChange(e.target.value as UserRole)}
      className="rounded-full border border-primrose-ink/15 bg-primrose-white px-2 py-1 text-xs disabled:opacity-50"
    >
      {ROLES.map((r) => (
        <option key={r} value={r}>
          {ROLE_LABELS[r]}
        </option>
      ))}
    </select>
  );
}

export function UtilisateursTable({
  locale,
  utilisateurs,
}: {
  locale: string;
  utilisateurs: Utilisateur[];
}) {
  const columns = [
    helper.accessor("full_name", { header: "Nom" }),
    helper.accessor("email", { header: "E-mail" }),
    helper.display({
      id: "role",
      header: "Rôle",
      cell: ({ row }) => <RoleSelect locale={locale} utilisateur={row.original} />,
    }),
    helper.display({
      id: "is_active",
      header: "Statut",
      cell: ({ row }) => (
        <ToggleSwitch
          checked={row.original.is_active}
          onToggle={(next) => toggleUtilisateurActif(locale, row.original.id, next)}
          labelOn="Actif"
          labelOff="Désactivé"
        />
      ),
    }),
  ];

  return (
    <AdminDataTable
      data={utilisateurs}
      columns={columns}
      searchPlaceholder="Rechercher un utilisateur…"
      emptyMessage="Aucun utilisateur."
    />
  );
}
