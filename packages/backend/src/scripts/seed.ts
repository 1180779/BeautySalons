import 'reflect-metadata';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import {DataSource} from 'typeorm';
import * as dotenv from 'dotenv';
import type {CollectedSalon, SalonPhoto} from '@beauty-salons/shared';
import {SalonEntity} from '../salon/salon.entity';

dotenv.config({path: resolve(__dirname, '../../../..', '.env')});

const ds = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    username: process.env.POSTGRES_USER ?? 'beauty',
    password: process.env.POSTGRES_PASSWORD ?? 'beauty',
    database: process.env.POSTGRES_DB ?? 'beauty_salons',
    entities: [SalonEntity],
    synchronize: false,
});

const apiKey = process.env.GOOGLE_MAPS_API_KEY ?? '';

function photosFromRaw(raw: any): SalonPhoto[] {
    return (raw?.photos ?? []).slice(0, 3).flatMap((p: any) => {
        if (!p.name) return [];
        const url = `https://places.googleapis.com/v1/${p.name}/media?maxWidthPx=800&key=${apiKey}`;
        const attributions = (p.authorAttributions ?? []).map((a: any) => ({
            displayName: a.displayName ?? '',
            uri: a.uri ?? '',
            photoUri: a.photoUri ?? '',
        }));
        return [{url, attributions}];
    });
}

function toEntity(s: CollectedSalon) {
    const {_raw, ...rest} = s;
    const photos = rest.photos.length ? rest.photos : photosFromRaw(_raw);
    return {...rest, photos};
}

async function seed() {
    const salonsPath = resolve(__dirname, '../../../collector/salons.json');
    const raw: CollectedSalon[] = JSON.parse(readFileSync(salonsPath, 'utf-8'));

    await ds.initialize();
    const repo = ds.getRepository(SalonEntity);

    let inserted = 0, updated = 0;

    for (const s of raw) {
        const existing = await repo.findOneBy({placeId: s.placeId});
        const data = toEntity(s);

        if (existing) {
            Object.assign(existing, data);
            await repo.save(existing);
            updated++;
        } else {
            await repo.insert(data);
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
