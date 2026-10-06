"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { PageTransition } from "@/components/motion/page-transition";
import { QuickExit } from "@/components/layout/quick-exit";

/** Espace admin : pas de chrome public (navbar, pied de page, bouton de fuite). */
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

  if (isStaffArea(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      {navbar}
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      {footer}
      <QuickExit />
    </>
  );
}
