import {PlacesClient, protos} from '@googlemaps/places';

type IAddressComponent = protos.google.maps.places.v1.Place.IAddressComponent;
type ISearchNearbyRequest = protos.google.maps.places.v1.ISearchNearbyRequest;

export type IPlace = protos.google.maps.places.v1.IPlace;

export interface LatLng {
    latitude: number;
    longitude: number;
}

const FIELD_MASK = [
    'places.id',
    'places.displayName',
    'places.formattedAddress',
    'places.addressComponents',
    'places.internationalPhoneNumber',
    'places.websiteUri',
    'places.rating',
    'places.userRatingCount',
    'places.priceLevel',
    'places.priceRange',
    'places.types',
    'places.primaryType',
    'places.location',
    'places.businessStatus',
    'places.regularOpeningHours.weekdayDescriptions',
    'places.photos',
].join(',');

const client = new PlacesClient();

export async function searchNearby(
    includedTypes: string[],
    center: LatLng,
    radiusMeters: number,
): Promise<IPlace[]> {
    const request: ISearchNearbyRequest = {
        includedTypes,
        maxResultCount: 20,
        locationRestriction: {
            circle: {
                center,
                radius: radiusMeters,
            },
        },
    };

    const [response] = await client.searchNearby(request, {
        otherArgs: {headers: {'X-Goog-FieldMask': FIELD_MASK}},
    });

    return response.places ?? [];
}

export async function getPhotoUri(name: string, maxWidthPx = 800): Promise<string | null> {
    try {
        const [media] = await client.getPhotoMedia({name, maxWidthPx});
        return media.photoUri ?? null;
    } catch {
        return null;
    }
}

const NOISE_TYPES = new Set([
    'point_of_interest', 'establishment', 'health', 'service',
    'store', 'food', 'finance', 'premise',
]);

export function extractDistrict(components: IAddressComponent[] | null | undefined): string | null {
    if (!components) return null;
    return components.find(
        c => c.types?.includes('sublocality_level_1') || c.types?.includes('sublocality'),
    )?.longText ?? null;
}

export function extractServices(types: string[] | null | undefined): string[] {
    return (types ?? []).filter(t => !NOISE_TYPES.has(t));
}

const PRICE_LEVEL_MAP: Record<string, number> = {
    PRICE_LEVEL_UNSPECIFIED: 0,
    PRICE_LEVEL_FREE: 1,
    PRICE_LEVEL_INEXPENSIVE: 2,
    PRICE_LEVEL_MODERATE: 3,
    PRICE_LEVEL_EXPENSIVE: 4,
    PRICE_LEVEL_VERY_EXPENSIVE: 5,
};

export function mapPriceLevel(raw: string | number | null | undefined): number | null {
    if (raw == null) return null;
    if (typeof raw === 'number') return raw;
    return PRICE_LEVEL_MAP[raw] ?? null;
}
