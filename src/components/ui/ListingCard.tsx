import { Heart, MapPin, Maximize2, BedDouble, Bath } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { MockListing } from "@/types/listing";

interface ListingCardProps {
  listing: MockListing;
  isSelected?: boolean;
  onHover?: (id: string | null) => void;
}

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: "Apartament",
  HOUSE: "Casă",
  STUDIO: "Studio",
  VILLA: "Vilă",
  LAND: "Teren",
  COMMERCIAL: "Comercial",
};

export function ListingCard({ listing, isSelected, onHover }: ListingCardProps) {
  const isRent = listing.transactionType === "RENT";

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className={`group flex gap-3 p-3 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
        isSelected
          ? "border-gold bg-gold/5 shadow-md"
          : "border-border bg-white/60 hover:border-gold/40"
      }`}
      onMouseEnter={() => onHover?.(listing.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Image */}
      <div className="relative w-24 h-20 shrink-0 rounded-lg overflow-hidden bg-border">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="96px"
          unoptimized
        />
        {listing.featured && (
          <span className="absolute top-1 left-1 text-[10px] font-semibold bg-gold text-dark px-1.5 py-0.5 rounded-sm">
            TOP
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <p className="text-[11px] text-muted font-medium uppercase tracking-wide">
            {TYPE_LABELS[listing.type]} · {listing.neighborhood}
          </p>
          <button
            className="text-muted hover:text-gold transition-colors shrink-0 -mt-0.5"
            onClick={(e) => { e.preventDefault(); }}
          >
            <Heart className="w-3.5 h-3.5" />
          </button>
        </div>

        <h3
          className="text-sm font-semibold text-dark leading-tight mt-0.5 truncate"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          {listing.title}
        </h3>

        {/* Price */}
        <p
          className="text-base font-bold text-dark mt-1"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          {listing.price.toLocaleString("ro-RO")} {listing.currency}
          {isRent && <span className="text-xs font-normal text-muted">/lună</span>}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Maximize2 className="w-3 h-3" />
            {listing.area} m²
          </span>
          {listing.rooms > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble className="w-3 h-3" />
              {listing.rooms} cam.
            </span>
          )}
          <span className="flex items-center gap-1">
            <Bath className="w-3 h-3" />
            {listing.bathrooms} băi
          </span>
          {!isRent && (
            <span
              className="ml-auto text-[10px] font-medium"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              {listing.pricePerSqm.toLocaleString("ro-RO")} €/m²
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
