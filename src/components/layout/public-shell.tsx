"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { PageTransition } from "@/components/motion/page-transition";
import { useDoubleEscapeExit } from "@/components/layout/use-double-escape-exit";

/** Espace admin : pas de chrome public, et Échap y ferme les dialogues (pas de sortie rapide). */
function isStaffArea(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function PublicShell({
  navbar,
  footer,
  children,
}: {
  navbar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const staff = isStaffArea(pathname);
  useDoubleEscapeExit(!staff);

  if (staff) {
    return <>{children}</>;
  }

  return (
    <>
      {navbar}
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      {footer}
    </>
  );
}
