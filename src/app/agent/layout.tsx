import { requireRole } from "@/lib/auth-helpers";

export default async function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("agent");
  return <>{children}</>;
}
