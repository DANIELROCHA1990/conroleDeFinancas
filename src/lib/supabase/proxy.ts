import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnv } from "@/lib/env";

const protectedRoutes = [
  "/dashboard",
  "/categorias",
  "/entradas",
  "/despesas",
  "/contas-fixas",
  "/cartoes",
  "/reservas",
  "/relatorios",
  "/configuracoes",
];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });
  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route)) &&
    !user
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);

    return NextResponse.redirect(url);
  }

  return response;
}
