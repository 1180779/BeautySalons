export enum PriceLevel {
    PRICE_LEVEL_UNSPECIFIED = 0,
    PRICE_LEVEL_FREE = 1,
    PRICE_LEVEL_INEXPENSIVE = 2,
    PRICE_LEVEL_MODERATE = 3,
    PRICE_LEVEL_EXPENSIVE = 4,
    PRICE_LEVEL_VERY_EXPENSIVE = 5,
}

export interface PriceRange {
    startPrice: number | null;
    endPrice: number | null;
    currency: string | null;
}

/** Raw collected record as written to salons.json by the collector script. */
export interface CollectedSalon {
    placeId: string;
    name: string;
    address: string;
    district: string | null;
    phoneNumber: string | null;
    website: string | null;
    services: string[];
    primaryType: string | null;
    priceLevel: number | null;
    priceRange: PriceRange | null;
    rating: number | null;
    reviewCount: number | null;
    latitude: number | null;
    longitude: number | null;
    openingHours: string[] | null;
    photos: string[];
    // TODO: strip before seeding to DB once data shape is stable
    _raw: unknown;
}

export interface Salon {
    id: number;
    placeId: string;
    name: string;
    address: string | null;
    district: string | null;
    phoneNumber: string | null;
    website: string | null;
    services: string[];
    priceLevel: PriceLevel | null;
    priceRange: PriceRange | null;
    rating: number | null;
    reviewCount: number | null;
    latitude: number | null;
    longitude: number | null;
    openingHours: string[] | null;
    photos: string[];
    createdAt: string;
    updatedAt: string;
}

export type SalonListItem = Pick<Salon, 'id' | 'name' | 'district' | 'rating' | 'reviewCount' | 'priceLevel' | 'address' | 'photos'>;

export type UpdateSalonDto = Partial<Pick<Salon, 'name' | 'address' | 'district' | 'phoneNumber' | 'website' | 'services' | 'priceLevel' | 'rating' | 'reviewCount'>>;

export interface SalonPage {
    items: SalonListItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
