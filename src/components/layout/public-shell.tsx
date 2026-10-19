"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { PageTransition } from "@/components/motion/page-transition";
import { useDoubleEscapeExit } from "@/components/layout/use-double-escape-exit";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { RouteCurtain } from "@/components/motion/route-curtain";

/** Espace admin : pas de chrome public, et Échap y ferme les dialogues (pas de sortie rapide). */
function isStaffArea(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function PublicShell({
  navbar,
  ticker,
  footer,
  children,
}: {
  navbar: ReactNode;
  ticker: ReactNode;
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
      <SmoothScroll />
      <RouteCurtain />
      {navbar}
      {ticker}
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      {footer}
    </>
  );
}
