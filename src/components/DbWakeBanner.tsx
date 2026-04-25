"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Trezim infrastructura, mai dă-mi câteva secunde…",
  "Serverul își bea cafeaua. Vine imediat.",
  "Pornesc motoarele, hold on…",
  "Baza de date sforăia. O trezesc acum.",
  "Dăm un șut serverului — vine îndată.",
  "Aprindem becurile prin server room…",
  "Spinning up the infrastructure, one moment…",
];

const POLL_MS = 4000;

export function DbWakeBanner() {
  const [waking, setWaking] = useState(false);
  const [message] = useState(
    () => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
  );

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const check = async () => {
      try {
        const res = await fetch("/api/health/db", { cache: "no-store" });
        if (cancelled) return;
        if (res.status === 503) {
          setWaking(true);
          timer = setTimeout(check, POLL_MS);
        } else {
          setWaking(false);
        }
      } catch {
        if (cancelled) return;
        setWaking(true);
        timer = setTimeout(check, POLL_MS);
      }
    };

    check();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!waking) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-3 bg-[#c8a96e] px-4 py-2.5 text-sm font-medium text-[#1a1812] shadow-md">
      <span
        className="inline-block h-3 w-3 animate-pulse rounded-full bg-[#1a1812]/40"
        aria-hidden
      />
      <span>{message}</span>
    </div>
  );
}
