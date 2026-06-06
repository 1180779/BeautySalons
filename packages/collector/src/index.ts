import {writeFileSync} from 'fs';
import {extractDistrict, extractServices, IPlace, mapPriceLevel, searchNearby} from './places-client';
import type {CollectedSalon, PriceRange, SalonPhoto} from '@beauty-salons/shared';

const TARGET = 10_000_000;
const OUTPUT_FILE = 'salons.json';

const TYPES = [
    'beauty_salon',
    'hair_salon',
    'nail_salon',
    'barber_shop',
    'beautician',
    'makeup_artist',
    'hair_care',
];

const DISTRICT_CENTERS: Array<{ name: string; center: { latitude: number; longitude: number } }> = [
    {name: 'Śródmieście', center: {latitude: 52.2297, longitude: 21.0122}},
    {name: 'Mokotów', center: {latitude: 52.1952, longitude: 21.0158}},
    {name: 'Wola', center: {latitude: 52.2350, longitude: 20.9720}},
    {name: 'Praga-Południe', center: {latitude: 52.2390, longitude: 21.0680}},
    {name: 'Praga-Północ', center: {latitude: 52.2530, longitude: 21.0450}},
    {name: 'Żoliborz', center: {latitude: 52.2760, longitude: 20.9940}},
    {name: 'Ursynów', center: {latitude: 52.1490, longitude: 21.0370}},
    {name: 'Bielany', center: {latitude: 52.2930, longitude: 20.9620}},
    {name: 'Targówek', center: {latitude: 52.2740, longitude: 21.0800}},
    {name: 'Bemowo', center: {latitude: 52.2510, longitude: 20.9270}},
    {name: 'Ochota', center: {latitude: 52.2180, longitude: 20.9860}},
    {name: 'Wilanów', center: {latitude: 52.1650, longitude: 21.0870}},
];

const SEARCH_RADIUS_METERS = 2500;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function extractPriceRange(place: IPlace): PriceRange | null {
    const pr = (place as any).priceRange;
    if (!pr) return null;
    const currency = pr.startPrice?.currencyCode ?? pr.endPrice?.currencyCode ?? null;
    const startPrice = pr.startPrice?.units != null ? Number(pr.startPrice.units) : null;
    const endPrice = pr.endPrice?.units != null ? Number(pr.endPrice.units) : null;
    if (startPrice == null && endPrice == null) return null;
    return {startPrice, endPrice, currency};
}

function extractPhotos(place: IPlace): SalonPhoto[] {
    return (place.photos ?? []).slice(0, 3).flatMap(p => {
        if (!p.name) return [];
        const attributions = (p.authorAttributions ?? []).map((a: any) => ({
            displayName: a.displayName ?? '',
            uri: a.uri ?? '',
            photoUri: a.photoUri ?? '',
        }));
        return [{url: p.name, attributions}];
    });
}

function normalize(place: IPlace): CollectedSalon {
    return {
        placeId: place.id ?? '',
        name: place.displayName?.text ?? '',
        address: place.formattedAddress ?? '',
        district: extractDistrict(place.addressComponents),
        phoneNumber: place.internationalPhoneNumber ?? null,
        website: place.websiteUri ?? null,
        services: extractServices(place.types),
        primaryType: place.primaryType ?? null,
        priceLevel: mapPriceLevel(place.priceLevel as any),
        priceRange: extractPriceRange(place),
        rating: place.rating ?? null,
        reviewCount: place.userRatingCount ?? null,
        latitude: place.location?.latitude ?? null,
        longitude: place.location?.longitude ?? null,
        openingHours: place.regularOpeningHours?.weekdayDescriptions ?? null,
        photos: extractPhotos(place),
        _raw: place,
    };
}

function save(salons: CollectedSalon[]): void {
    writeFileSync(OUTPUT_FILE, JSON.stringify(salons, null, 2));
}

async function main() {
    const seen = new Set<string>();
    const salons: CollectedSalon[] = [];
    let requestCount = 0;

    outer:
        for (const type of TYPES) {
            for (const district of DISTRICT_CENTERS) {
                process.stdout.write(`[${type}] ${district.name} ... `);

                try {
                    const places = await searchNearby([type], district.center, SEARCH_RADIUS_METERS);
                    requestCount++;

                    let newCount = 0;
                    for (const place of places) {
                        if (!place.id || seen.has(place.id)) continue;
                        seen.add(place.id);
                        const salon = normalize(place);
                        salons.push(salon);
                        newCount++;
                    }

                    console.log(`${places.length} results, ${newCount} new (total: ${seen.size})`);
                    save(salons);

                    if (seen.size >= TARGET) {
                        console.log(`\nTarget of ${TARGET} reached — stopping early.`);
                        break outer;
                    }
                } catch (err) {
                    console.error(`ERROR: ${err instanceof Error ? err.message : err}`);
                }

                await sleep(150);
            }
        }

    console.log(`\nDone: ${salons.length} unique salons, ${requestCount} API requests`);
    console.log(`Saved to ${OUTPUT_FILE}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
