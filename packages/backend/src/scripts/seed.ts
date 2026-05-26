import 'reflect-metadata';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import {DataSource} from 'typeorm';
import * as dotenv from 'dotenv';
import type {CollectedSalon, PriceLevel} from '@beauty-salons/shared';
import {SalonEntity} from '../salon/salon.entity';

dotenv.config({path: resolve(__dirname, '../../../..', '.env')});

const PRICE_LEVEL_MAP: Record<string, PriceLevel> = {
    '1': 'PRICE_LEVEL_INEXPENSIVE',
    '2': 'PRICE_LEVEL_MODERATE',
    '3': 'PRICE_LEVEL_EXPENSIVE',
    '4': 'PRICE_LEVEL_VERY_EXPENSIVE',
};

const ds = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    username: process.env.POSTGRES_USER ?? 'beauty',
    password: process.env.POSTGRES_PASSWORD ?? 'beauty',
    database: process.env.POSTGRES_DB ?? 'beauty_salons',
    entities: [SalonEntity],
    synchronize: true,
});

async function seed() {
    const salonsPath = resolve(__dirname, '../../../collector/salons.json');
    const raw: CollectedSalon[] = JSON.parse(readFileSync(salonsPath, 'utf-8'));

    await ds.initialize();
    const repo = ds.getRepository(SalonEntity);

    let inserted = 0, updated = 0;

    for (const s of raw) {
        const existing = await repo.findOneBy({placeId: s.placeId});
        const priceLevel = s.priceLevel != null ? PRICE_LEVEL_MAP[s.priceLevel] ?? null : null;

        if (existing) {
            Object.assign(existing, {
                name: s.name, address: s.address, district: s.district,
                phoneNumber: s.phoneNumber, website: s.website,
                services: s.services, primaryType: s.primaryType,
                priceLevel, rating: s.rating, reviewCount: s.reviewCount,
                latitude: s.latitude, longitude: s.longitude,
                openingHours: s.openingHours,
            });
            await repo.save(existing);
            updated++;
        } else {
            await repo.insert({
                placeId: s.placeId, name: s.name, address: s.address,
                district: s.district, phoneNumber: s.phoneNumber,
                website: s.website, services: s.services,
                primaryType: s.primaryType, priceLevel,
                rating: s.rating, reviewCount: s.reviewCount,
                latitude: s.latitude, longitude: s.longitude,
                openingHours: s.openingHours,
            });
            inserted++;
        }
    }

    await ds.destroy();
    console.log(`Seed complete: ${inserted} inserted, ${updated} updated`);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
