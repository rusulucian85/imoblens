# ImobLens — Master Development Plan

**Romanian Real Estate Transparency Platform**
v1.0 — 2026

## Viziune

Prima platformă imobiliară din România care oferă transparență reală:
- Prețuri cerute
- Prețuri reale de tranzacție
- Hartă cu pin exact pe adresă
- Workflow complet de decizie pentru cumpărători

**Stil Booking.com pentru imobiliare.** User-first, nu agent-first. Userul intră, știe exact
ce face, ia o decizie informată fără să depindă de agent.

## Rol Claude

Arhitect și developer principal.

## Roluri utilizatori

| Rol | Acces |
|---|---|
| `VISITOR` | Browsing public, fără cont |
| `BUYER` | Cont gratuit, favorite, alerte |
| `BUYER_PRO` | 9€/lună — vede prețuri reale de tranzacție |
| `AGENT` | Publică anunțuri, primește leads |
| `AGENT_PRO` | 79€/lună — analytics + push leads |
| `ADMIN` | Acces complet |

## Tech stack (actual, nu planificat)

- **Next.js 16.2.4** — App Router, TypeScript, Tailwind v4. (Plan inițial era 15 — instalat 16, breaking changes documentate în AGENTS.md.)
- **Database: Azure SQL Server** — Flexible nu există pe SQL Server; folosim Azure SQL standard. Plan inițial era PostgreSQL, dar contul tău Azure are deja SQL Server. Consecințe: fără enums, fără `String[]` arrays, fără multi-path cascade — toate convertite la `String` cu valori în comentarii.
- **Prisma 7.8.0** cu `@prisma/adapter-mssql` + `tedious`. Migrații: `prisma db push` (nu `migrate dev` — Azure SQL nu permite shadow DB).
- **Auth: NextAuth v5 beta.31** — Google + Facebook + email/password. (Apple OAuth nu se face — costă 99$/an.)
- **Maps: Leaflet** (open-source, fără token). Mapbox nu e nevoie.
- **AI: Anthropic SDK** (Claude Sonnet) — chatbot filtrare live.
- **Storage: Azure Blob** (poze listings).
- **Email: Resend.**
- **Payments: Stripe Checkout** — suportă Google Pay și Apple Pay nativ (asta era "calea ușoară" pe care o voiai).
- **Mobile (Faza 8): Capacitor** — wrapper WebView nativ peste build-ul Next, exact paradigma "HTML5 embedded browser". Detalii arhitecturale când ajungem.
- **Hosting: Azure App Service Linux Node 22**, deploy prin GitHub Actions doar la `release.published`.

## Sursa prețurilor reale de tranzacție

**Self-reported de owner-ul listing-ului.** `Listing.ownerId` (FK User) marchează cine deține proprietatea. După vânzare, owner-ul completează un `Transaction` cu `priceSold` + demografice anonimizate ale cumpărătorului. `Transaction.verified` (Boolean) permite admin-verification flow ulterior. Sursă alternativă (ANCPI, admin) păstrată ca enum în câmpul `Transaction.source` pentru viitor.

## Faze (overview)

| # | Numele fazei | Ce face |
|---|---|---|
| 1 | Fundație | Project setup, schema DB, NextAuth funcțional |
| 2 | Core features | Hartă Leaflet + listings + AI chatbot cu filtrare live |
| 3 | User features | Shortlist, booking vizualizări, PWA + push, saved searches |
| 4 | Monetizare | Stripe Checkout + content gating premium |
| 5 | Admin & analytics | Dashboard admin, analytics platformă, dashboard agent |
| 6 | Security & performance | Rate limiting, headers, GDPR, indexes, caching, CDN |
| 7 | DevOps | Env management, monitoring (App Insights), backups |
| 8 | Mobile | Capacitor pentru iOS + Android |
