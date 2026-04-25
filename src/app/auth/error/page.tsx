import Link from "next/link";

export const metadata = {
  title: "Eroare autentificare — ImobLens",
};

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "Configurare server lipsă. Anunță-ne, te rog.",
  AccessDenied: "Acces refuzat. Contul tău a fost blocat sau nu are permisiuni.",
  Verification: "Link-ul de verificare a expirat sau a fost folosit deja.",
  OAuthSignin: "Nu am putut iniția autentificarea cu provider-ul ales.",
  OAuthCallback: "Răspuns invalid de la provider. Încearcă din nou.",
  OAuthAccountNotLinked:
    "Există deja un cont cu acest email folosind alt provider. Intră cu provider-ul original.",
  EmailSignin: "Nu am putut trimite email-ul. Verifică adresa și reîncearcă.",
  CredentialsSignin: "Date de autentificare incorecte.",
  SessionRequired: "Trebuie să fii autentificat pentru a accesa pagina.",
  default: "Ceva nu a mers. Încearcă să te autentifici din nou.",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = ERROR_MESSAGES[error ?? "default"] ?? ERROR_MESSAGES.default;

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white/60 p-8 shadow-sm">
        <h1
          className="text-2xl font-semibold text-dark"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Hopa, n-a mers
        </h1>
        <p className="mt-3 text-sm text-muted">{message}</p>
        {error && (
          <p className="mt-2 text-xs uppercase tracking-wider text-muted/70">
            Cod: {error}
          </p>
        )}
        <Link
          href="/login"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-dark px-4 py-2.5 text-sm font-medium text-cream hover:bg-dark-2"
        >
          Încearcă din nou
        </Link>
      </div>
    </div>
  );
}
