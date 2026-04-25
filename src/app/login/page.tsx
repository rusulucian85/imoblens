import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Autentificare — ImobLens",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-white/60 p-8 shadow-sm backdrop-blur">
          <h1
            className="font-[family-name:var(--font-syne)] text-3xl font-semibold text-dark"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Bine ai venit
          </h1>
          <p className="mt-2 text-sm text-muted">
            Intră în cont sau creează unul nou cu Google, Facebook sau email.
          </p>

          <Suspense
            fallback={<div className="mt-8 h-32 animate-pulse rounded bg-border/40" />}
          >
            <LoginForm />
          </Suspense>

          <p className="mt-6 text-center text-xs text-muted">
            Continuând, accepți{" "}
            <Link href="/terms" className="underline hover:text-gold">
              Termenii
            </Link>{" "}
            și{" "}
            <Link href="/privacy" className="underline hover:text-gold">
              Confidențialitatea
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
