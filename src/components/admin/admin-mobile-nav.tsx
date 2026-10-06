"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import type { UserRole } from "@/types/database";

const ALL_LINKS = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/contenus", label: "Contenus du site" },
  { href: "/admin/missions", label: "Missions & valeurs" },
  { href: "/admin/formations", label: "Formations" },
  { href: "/admin/actualites", label: "Actualités" },
  { href: "/admin/evenements", label: "Événements" },
  { href: "/admin/mediatheque", label: "Médiathèque" },
  { href: "/admin/equipe", label: "Équipe" },
  { href: "/admin/partenaires", label: "Partenaires" },
  { href: "/admin/reseaux-sociaux", label: "Réseaux sociaux" },
  { href: "/admin/parametres", label: "Paramètres" },
  { href: "/admin/adhesions", label: "Adhésions", minRole: "admin" },
  { href: "/admin/messages", label: "Messages de contact", minRole: "admin" },
  { href: "/admin/demandes-aide", label: "Demandes d'aide", minRole: "admin" },
  { href: "/admin/utilisateurs", label: "Utilisateurs admin", minRole: "super_admin" },
  { href: "/admin/audit", label: "Journal d'audit", minRole: "super_admin" },
] as const;

function canSee(role: UserRole, minRole?: "admin" | "super_admin") {
  if (!minRole) return true;
  if (minRole === "super_admin") return role === "super_admin";
  return role !== "editor";
}

export function AdminMobileNav({ role }: { role: UserRole }) {
  const router = useRouter();
  const pathname = usePathname();
  const links = ALL_LINKS.filter((l) => canSee(role, "minRole" in l ? l.minRole : undefined));

  return (
    <select
      value={pathname}
      onChange={(e) => router.push(e.target.value)}
      className="mb-4 w-full rounded-lg border border-primrose-ink/15 bg-primrose-white px-3 py-2 text-sm md:hidden"
      aria-label="Navigation admin"
    >
      {links.map((l) => (
        <option key={l.href} value={l.href}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
