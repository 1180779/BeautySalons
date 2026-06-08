import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import {resolve} from 'path';
import * as dotenv from 'dotenv';
import type {CollectedSalon, SalonPhoto} from '@beauty-salons/shared';
import {getPhotoUri} from './places-client';

dotenv.config({path: resolve(__dirname, '../../..', '.env')});

const SALONS_JSON = resolve(__dirname, '..', 'salons.json');
const PHOTOS_DIR = resolve(__dirname, '../../frontend/public/photos');

async function downloadToFile(url: string, dest: string): Promise<void> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

async function main() {
    mkdirSync(PHOTOS_DIR, {recursive: true});

    const salons: CollectedSalon[] = JSON.parse(readFileSync(SALONS_JSON, 'utf-8'));

    let downloaded = 0, skipped = 0, failed = 0;

    for (let si = 0; si < salons.length; si++) {
        const salon = salons[si];
        const rawPhotos = (salon._raw as any)?.photos ?? [];
        const sources: SalonPhoto[] = salon.photos.length
            ? salon.photos
            : rawPhotos.slice(0, 3).map((p: any) => ({
                url: p.name ?? '',
                attributions: (p.authorAttributions ?? []).map((a: any) => ({
                    displayName: a.displayName ?? '',
                    uri: a.uri ?? '',
                    photoUri: a.photoUri ?? '',
                })),
            }));

        const updatedPhotos: SalonPhoto[] = [];
        let salonChanged = false;

        for (let i = 0; i < sources.length; i++) {
            const photo = sources[i];

            if (!photo.url || !photo.url.startsWith('places/')) {
                updatedPhotos.push(photo);
                skipped++;
                continue;
            }

            const filename = `${salon.placeId}_${i}.jpg`;
            const dest = resolve(PHOTOS_DIR, filename);
            const localUrl = `/photos/${filename}`;

            if (existsSync(dest)) {
                updatedPhotos.push({...photo, url: localUrl});
                skipped++;
                salonChanged = true;
                continue;
            }

            process.stdout.write(`[${si + 1}/${salons.length}] ${salon.name} photo ${i + 1}... `);

            const cdnUrl = await getPhotoUri(photo.url);
            if (!cdnUrl) {
                console.log(`FAIL (no URI returned)`);
                updatedPhotos.push(photo);
                failed++;
                continue;
            }

            try {
                await downloadToFile(cdnUrl, dest);
                updatedPhotos.push({...photo, url: localUrl});
                downloaded++;
                salonChanged = true;
                console.log(`OK`);
            } catch (err) {
                console.log(`FAIL (${err instanceof Error ? err.message : err})`);
                updatedPhotos.push(photo);
                failed++;
            }
        }

        if (salonChanged) {
            salon.photos = updatedPhotos;
            writeFileSync(SALONS_JSON, JSON.stringify(salons, null, 2));
        }
    }

    console.log(`\nDone: ${downloaded} downloaded, ${failed} failed, ${skipped} skipped`);
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
