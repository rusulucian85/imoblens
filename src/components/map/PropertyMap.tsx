"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import type { MockListing } from "@/types/listing";

interface PropertyMapProps {
  listings: MockListing[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function formatPrice(price: number, transactionType: string) {
  if (transactionType === "RENT") return `${price}€/lună`;
  if (price >= 1000) return `${(price / 1000).toFixed(0)}K€`;
  return `${price}€`;
}

export function PropertyMap({ listings, selectedId, onSelect }: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, LeafletMarker>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Dynamic import to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix default icon path issue in bundlers — Leaflet's Icon.Default
      // uses a private _getIconUrl that needs to be deleted before merge.
      delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, {
        center: [45.792, 24.152],
        zoom: 14,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Add price markers
      listings.forEach((listing) => {
        const el = document.createElement("div");
        el.className = `price-pin${selectedId === listing.id ? " active" : ""}`;
        el.textContent = formatPrice(listing.price, listing.transactionType);
        el.setAttribute("data-id", listing.id);
        el.style.position = "relative";

        const icon = L.divIcon({
          html: el.outerHTML,
          className: "",
          iconAnchor: [0, 0],
        });

        const marker = L.marker([listing.latitude, listing.longitude], { icon });
        marker.on("click", () => onSelect(listing.id));
        marker.addTo(map);
        markersRef.current[listing.id] = marker;
      });

      mapRef.current = map;
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker styles when selection changes
  useEffect(() => {
    import("leaflet").then((L) => {
      listings.forEach((listing) => {
        const marker = markersRef.current[listing.id];
        if (!marker) return;
        const el = document.createElement("div");
        el.className = `price-pin${selectedId === listing.id ? " active" : ""}`;
        el.textContent = formatPrice(listing.price, listing.transactionType);
        el.style.position = "relative";
        marker.setIcon(L.divIcon({ html: el.outerHTML, className: "", iconAnchor: [0, 0] }));
      });

      // Pan to selected
      if (selectedId) {
        const listing = listings.find((l) => l.id === selectedId);
        if (listing && mapRef.current) {
          mapRef.current.panTo([listing.latitude, listing.longitude], { animate: true });
        }
      }
    });
  }, [selectedId, listings]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: 400 }}
    />
  );
}
