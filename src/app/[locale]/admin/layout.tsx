import { Toaster } from "sonner";
import { requireStaff } from "@/lib/admin/current-admin";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { profile } = await requireStaff(locale);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-primrose-cream">
      <AdminHeader fullName={profile.full_name} role={profile.role} />
      <div className="flex min-h-0 flex-1">
        <AdminSidebar role={profile.role} />
        <main className="admin-main min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-8 md:px-10 md:py-10">
            <AdminMobileNav role={profile.role} />
            {children}
          </div>
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
