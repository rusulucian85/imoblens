export const metadata = { title: "Agent — ImobLens" };

export default function AgentPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1
        className="text-3xl font-semibold text-dark"
        style={{ fontFamily: "var(--font-syne)" }}
      >
        Panou agent
      </h1>
      <p className="mt-2 text-sm text-muted">
        Aici vor apărea anunțurile, lead-urile și calendarul de vizionări.
      </p>
    </div>
  );
}
