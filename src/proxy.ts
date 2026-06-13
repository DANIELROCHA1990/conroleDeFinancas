import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/categorias/:path*", "/entradas/:path*", "/despesas/:path*", "/contas-fixas/:path*", "/cartoes/:path*", "/reservas/:path*", "/relatorios/:path*", "/configuracoes/:path*"],
};
