import { NextResponse } from "next/server";

import { buildDashboardSummary } from "@/features/dashboard/services/dashboard-service";

export async function GET() {
  const data = await buildDashboardSummary();

  return NextResponse.json(data);
}
