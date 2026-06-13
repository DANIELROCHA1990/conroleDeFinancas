import { NextResponse } from "next/server";

import { buildDashboardSummary } from "@/features/dashboard/services/dashboard-service";
import { generateSummaryPdf } from "@/lib/pdf/report-pdf-service";

export async function GET() {
  const summary = await buildDashboardSummary();
  const pdf = generateSummaryPdf(summary);

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=relatorio-financeiro.pdf",
    },
  });
}
