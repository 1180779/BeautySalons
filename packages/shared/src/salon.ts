export type PriceLevel =
    'PRICE_LEVEL_FREE'
    | 'PRICE_LEVEL_INEXPENSIVE'
    | 'PRICE_LEVEL_MODERATE'
    | 'PRICE_LEVEL_EXPENSIVE'
    | 'PRICE_LEVEL_VERY_EXPENSIVE';

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
    priceLevel: string | null;
    rating: number | null;
    reviewCount: number | null;
    latitude: number | null;
    longitude: number | null;
    openingHours: string[] | null;
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
    rating: number | null;
    reviewCount: number | null;
    latitude: number | null;
    longitude: number | null;
    createdAt: string;
    updatedAt: string;
}

export type SalonListItem = Pick<Salon, 'id' | 'name' | 'district' | 'rating' | 'reviewCount' | 'priceLevel' | 'address'>;

export type UpdateSalonDto = Partial<Pick<Salon, 'name' | 'address' | 'district' | 'phoneNumber' | 'website' | 'services' | 'priceLevel' | 'rating' | 'reviewCount'>>;
