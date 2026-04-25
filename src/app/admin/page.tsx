export const metadata = { title: "Admin — ImobLens" };

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1
        className="text-3xl font-semibold text-dark"
        style={{ fontFamily: "var(--font-syne)" }}
      >
        Admin
      </h1>
      <p className="mt-2 text-sm text-muted">
        Management useri, listings, agenții, audit logs.
      </p>
    </div>
  );
}
