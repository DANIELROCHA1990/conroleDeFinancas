import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/features/auth/server/require-user";

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireUser();

  return <AppShell>{children}</AppShell>;
}
