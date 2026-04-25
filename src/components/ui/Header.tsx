"use client";

import Link from "next/link";
import { MapPin, Heart, User, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-dark/95 backdrop-blur-sm border-b border-dark-2">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <MapPin className="w-5 h-5 text-gold" strokeWidth={2.5} />
          <span
            className="text-lg font-bold text-white tracking-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Imob<span className="text-gold">Lens</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm text-white/60 flex-1">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/5 transition-colors"
          >
            Hartă
          </Link>
          <Link
            href="/listings"
            className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/5 transition-colors"
          >
            Anunțuri
          </Link>
          <Link
            href="/agents"
            className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/5 transition-colors"
          >
            Agenți
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <Link
            href="/favorites"
            className="p-2 text-white/60 hover:text-gold transition-colors"
            title="Favorite"
          >
            <Heart className="w-4.5 h-4.5" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 text-gold text-sm font-medium hover:bg-gold hover:text-dark transition-all"
          >
            <User className="w-3.5 h-3.5" />
            Cont
          </Link>
          <Link
            href="/listings/new"
            className="px-4 py-1.5 rounded-full bg-gold text-dark text-sm font-semibold hover:bg-gold-light transition-colors"
          >
            Adaugă anunț
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden ml-auto text-white/70 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-dark-2 bg-dark px-4 py-3 flex flex-col gap-2 text-sm text-white/70">
          <Link href="/" onClick={() => setMenuOpen(false)} className="py-2 hover:text-white">Hartă</Link>
          <Link href="/listings" onClick={() => setMenuOpen(false)} className="py-2 hover:text-white">Anunțuri</Link>
          <Link href="/agents" onClick={() => setMenuOpen(false)} className="py-2 hover:text-white">Agenți</Link>
          <Link href="/favorites" onClick={() => setMenuOpen(false)} className="py-2 hover:text-white">Favorite</Link>
          <Link href="/login" onClick={() => setMenuOpen(false)} className="py-2 text-gold font-medium">Cont</Link>
        </div>
      )}
    </header>
  );
}
