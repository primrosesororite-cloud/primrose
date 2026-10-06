import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "@/i18n/routing";
import type { UserRole } from "@/types/database";

const handleI18nRouting = createMiddleware(routing);

const STAFF_ROLES: UserRole[] = ["super_admin", "admin", "editor"];

function isAdminPath(pathname: string) {
  return /^\/(fr|en)?\/?admin(\/|$)/.test(pathname);
}

export async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Projet Supabase pas encore provisionné (dev local) : routage i18n
    // seul, pas de rafraîchissement de session ni de garde /admin.
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: userData } = await supabase.auth.getUser();

  if (isAdminPath(request.nextUrl.pathname)) {
    if (!userData.user) {
      return NextResponse.redirect(new URL("/connexion", request.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", userData.user.id)
      .single();

    const role = profile?.role;
    if (!profile?.is_active || !role || !STAFF_ROLES.includes(role)) {
      return NextResponse.redirect(new URL("/connexion", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
