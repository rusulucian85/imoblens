import { auth } from "@/auth";

export const metadata = { title: "Dashboard — ImobLens" };

export default async function DashboardPage() {
  const session = await auth();
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1
        className="text-3xl font-semibold text-dark"
        style={{ fontFamily: "var(--font-syne)" }}
      >
        Salut, {session?.user?.name ?? "tu"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        Rolul tău: <span className="font-medium">{session?.user?.role}</span>
      </p>
    </div>
  );
}
