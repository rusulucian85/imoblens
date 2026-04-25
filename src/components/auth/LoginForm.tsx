"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export function LoginForm() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();
  const [emailSent, setEmailSent] = useState(false);

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    startTransition(async () => {
      await signIn("resend", { email, callbackUrl, redirect: false });
      setEmailSent(true);
    });
  };

  return (
    <div className="mt-8 space-y-3">
      <button
        onClick={() => signIn("google", { callbackUrl })}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-dark transition hover:border-gold hover:bg-cream"
      >
        <GoogleIcon />
        Continuă cu Google
      </button>

      <button
        onClick={() => signIn("facebook", { callbackUrl })}
        className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#1877F2] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#166fe0]"
      >
        <FacebookIcon />
        Continuă cu Facebook
      </button>

      <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-wider text-muted">
        <div className="h-px flex-1 bg-border" />
        sau
        <div className="h-px flex-1 bg-border" />
      </div>

      {emailSent ? (
        <div className="rounded-lg border border-gold/40 bg-gold-light/30 p-4 text-sm text-dark-2">
          Ți-am trimis un link de autentificare pe{" "}
          <span className="font-medium">{email}</span>. Verifică inbox-ul.
        </div>
      ) : (
        <form onSubmit={handleEmail} className="space-y-3">
          <input
            type="email"
            required
            placeholder="email@exemplu.ro"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm placeholder:text-muted/70 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-dark px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-dark-2 disabled:opacity-60"
          >
            {pending ? "Se trimite…" : "Trimite link de autentificare"}
          </button>
        </form>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.997 10.997 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A10.997 10.997 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
