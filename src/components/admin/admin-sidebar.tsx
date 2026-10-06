"use client";

import {
  LayoutDashboard,
  FileText,
  Flag,
  GraduationCap,
  Newspaper,
  CalendarDays,
  Image as ImageIcon,
  Users,
  Handshake,
  Share2,
  Settings,
  Mail,
  UserPlus,
  ShieldAlert,
  History,
  UserCog,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/database";

const CONTENT_LINKS = [
  { href: "/admin", label: "Tableau de bord", Icon: LayoutDashboard, exact: true },
  { href: "/admin/contenus", label: "Contenus du site", Icon: FileText },
  { href: "/admin/missions", label: "Missions & valeurs", Icon: Flag },
  { href: "/admin/formations", label: "Formations", Icon: GraduationCap },
  { href: "/admin/actualites", label: "Actualités", Icon: Newspaper },
  { href: "/admin/evenements", label: "Événements", Icon: CalendarDays },
  { href: "/admin/mediatheque", label: "Médiathèque", Icon: ImageIcon },
  { href: "/admin/equipe", label: "Équipe", Icon: Users },
  { href: "/admin/partenaires", label: "Partenaires", Icon: Handshake },
  { href: "/admin/reseaux-sociaux", label: "Réseaux sociaux", Icon: Share2 },
  { href: "/admin/parametres", label: "Paramètres", Icon: Settings },
] as const;

const DEMANDES_LINKS = [
  { href: "/admin/adhesions", label: "Adhésions", Icon: UserPlus },
  { href: "/admin/messages", label: "Messages de contact", Icon: Mail },
  { href: "/admin/demandes-aide", label: "Demandes d'aide", Icon: ShieldAlert },
] as const;

const SUPER_ADMIN_LINKS = [
  { href: "/admin/utilisateurs", label: "Utilisateurs admin", Icon: UserCog },
  { href: "/admin/audit", label: "Journal d'audit", Icon: History },
] as const;

function NavSection({
  title,
  links,
  pathname,
}: {
  title?: string;
  links: readonly { href: string; label: string; Icon: typeof LayoutDashboard; exact?: boolean }[];
  pathname: string;
}) {
  return (
    <div>
      {title && (
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-primrose-forest/70">
          {title}
        </p>
      )}
      <ul className="mt-2 space-y-1">
        {links.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primrose-forest text-primrose-white shadow-[0_8px_18px_-12px_rgba(52,80,59,0.8)]"
                    : "text-primrose-ink/85 hover:bg-primrose-cream hover:text-primrose-ink"
                )}
              >
                <Icon aria-hidden className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function AdminSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-primrose-ink/10 bg-primrose-white md:block">
      <div className="space-y-8 px-4 py-7">
        <NavSection links={CONTENT_LINKS} pathname={pathname} />

        {role !== "editor" && (
          <NavSection title="Demandes" links={DEMANDES_LINKS} pathname={pathname} />
        )}

        {role === "super_admin" && (
          <NavSection title="Administration" links={SUPER_ADMIN_LINKS} pathname={pathname} />
        )}
      </div>
    </aside>
  );
}
