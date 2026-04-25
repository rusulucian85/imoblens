"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { ListingCard } from "@/components/ui/ListingCard";
import { MOCK_LISTINGS } from "@/lib/mock-data";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

const PropertyMap = dynamic(
  () => import("@/components/map/PropertyMap").then((m) => m.PropertyMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-border animate-pulse" /> }
);

const TRANSACTION_FILTERS = [
  { label: "Toate", value: "" },
  { label: "Vânzare", value: "SALE" },
  { label: "Chirie", value: "RENT" },
];

const TYPE_FILTERS = [
  { label: "Orice tip", value: "" },
  { label: "Apartament", value: "APARTMENT" },
  { label: "Casă", value: "HOUSE" },
  { label: "Studio", value: "STUDIO" },
  { label: "Vilă", value: "VILLA" },
];

export default function HomePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [txFilter, setTxFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const filtered = MOCK_LISTINGS.filter((l) => {
    const matchTx = !txFilter || l.transactionType === txFilter;
    const matchType = !typeFilter || l.type === typeFilter;
    const matchSearch =
      !search ||
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
      l.address.toLowerCase().includes(search.toLowerCase());
    return matchTx && matchType && matchSearch;
  });

  const activeId = selectedId || hoveredId;

  return (
    <div className="flex flex-col flex-1" style={{ height: "calc(100vh - 56px)" }}>
      {/* Filter bar */}
      <div className="shrink-0 border-b border-border bg-white/80 backdrop-blur-sm px-4 py-2.5 flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
          <input
            type="text"
            placeholder="Caută cartier, stradă…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-cream border border-border rounded-lg focus:outline-none focus:border-gold/60 transition-colors"
          />
        </div>

        {/* Transaction type */}
        <div className="flex items-center gap-1 bg-cream rounded-lg border border-border p-0.5">
          {TRANSACTION_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setTxFilter(f.value)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                txFilter === f.value
                  ? "bg-dark text-gold"
                  : "text-muted hover:text-dark"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Property type */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none pl-3 pr-7 py-1.5 text-xs font-medium bg-cream border border-border rounded-lg focus:outline-none focus:border-gold/60 text-dark cursor-pointer"
          >
            {TYPE_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted" />
        </div>

        {/* Results count */}
        <span
          className="text-xs text-muted ml-auto"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          {filtered.length} proprietăți
        </span>

        <button className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-dark border border-border rounded-lg px-3 py-1.5 transition-colors">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filtre
        </button>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map (left) */}
        <div className="flex-1 relative overflow-hidden">
          {mounted && (
            <PropertyMap
              listings={filtered}
              selectedId={activeId}
              onSelect={setSelectedId}
            />
          )}
          {!mounted && (
            <div className="w-full h-full bg-cream flex items-center justify-center text-muted text-sm">
              Se încarcă harta…
            </div>
          )}
        </div>

        {/* Listings panel (right) */}
        <div className="w-[380px] shrink-0 overflow-y-auto border-l border-border bg-cream flex flex-col">
          {/* Hero text */}
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <h1
              className="text-lg font-bold text-dark"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Proprietăți în{" "}
              <span className="text-gold">Sibiu</span>
            </h1>
            <p className="text-xs text-muted mt-0.5">
              Prețuri reale · actualizate zilnic
            </p>
          </div>

          {/* Listings */}
          <div className="flex-1 p-3 flex flex-col gap-2">
            {filtered.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-sm text-muted py-12">
                Nicio proprietate nu corespunde filtrelor.
              </div>
            ) : (
              filtered.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isSelected={activeId === listing.id}
                  onHover={setHoveredId}
                />
              ))
            )}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-3 border-t border-border text-[11px] text-muted text-center">
            Date actualizate · ImobLens © 2025
          </div>
        </div>
      </div>
    </div>
  );
}
