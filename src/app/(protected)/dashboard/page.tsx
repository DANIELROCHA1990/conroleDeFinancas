import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ month?: string }>;
}) {
  const params = await searchParams;

  return <DashboardOverview selectedMonth={params?.month} />;
}
