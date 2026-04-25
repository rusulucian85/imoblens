export type ListingType = "APARTMENT" | "HOUSE" | "STUDIO" | "VILLA" | "LAND" | "COMMERCIAL";
export type TransactionType = "SALE" | "RENT";
export type ListingStatus = "ACTIVE" | "PENDING" | "SOLD" | "RENTED" | "WITHDRAWN";

export interface MockListing {
  id: string;
  slug: string;
  title: string;
  type: ListingType;
  transactionType: TransactionType;
  status: ListingStatus;
  price: number;
  currency: string;
  area: number;
  rooms: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  address: string;
  neighborhood: string;
  city: string;
  latitude: number;
  longitude: number;
  pricePerSqm: number;
  yearBuilt: number;
  parking: boolean;
  furnished: boolean;
  features: string[];
  energyClass: string;
  imageUrl: string;
  agentName: string;
  agentImage: string;
  agencyName: string;
  featured: boolean;
}
