import { NextResponse } from "next/server";

import { buildDashboardSummary } from "@/features/dashboard/services/dashboard-service";

export async function GET() {
  try {
    const data = await buildDashboardSummary();

    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/reports/summary] failed", error);
    return NextResponse.json(
      { error: "Nao foi possivel gerar o resumo." },
      { status: 500 },
    );
  }
}
