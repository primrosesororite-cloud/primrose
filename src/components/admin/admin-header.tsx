import { ExternalLink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SignOutButton } from "@/components/forms/sign-out-button";
import type { UserRole } from "@/types/database";

const ROLE_LABEL: Record<UserRole, string> = {
  super_admin: "Super administrateur",
  admin: "Administrateur",
  editor: "Éditeur",
};

export function AdminHeader({ fullName, role }: { fullName: string; role: UserRole }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 bg-primrose-forest px-4 text-primrose-white shadow-[0_6px_18px_-12px_rgba(0,0,0,0.5)] md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <span className="font-serif text-lg leading-none">Primrose</span>
        <span className="hidden rounded-full bg-primrose-white/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] sm:inline">
          Administration
        </span>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <Link
          href="/"
          className="hidden items-center gap-1.5 text-sm text-primrose-white/85 hover:text-primrose-white md:inline-flex"
        >
          Voir le site
          <ExternalLink aria-hidden className="h-3.5 w-3.5" />
        </Link>
        <div className="hidden text-right leading-tight sm:block">
          <p className="text-sm font-medium">{fullName || "—"}</p>
          <p className="text-[11px] text-primrose-white/70">{ROLE_LABEL[role]}</p>
        </div>
        <SignOutButton />
      </div>
    </header>
  );
}
