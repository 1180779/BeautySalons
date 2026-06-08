# Beauty Salons Warsaw

A full-stack web app for browsing beauty salons in Warsaw. Built as a recruitment exercise.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | NestJS, TypeORM |
| Database | PostgreSQL |
| Data collection | Google Places API (New) via Application Default Credentials |
| Monorepo | pnpm workspaces |

## Prerequisites

- Node.js 20+
- pnpm 11+
- Docker (for PostgreSQL)
- A Google Cloud project with the **Places API (New)** enabled
- `gcloud` CLI authenticated: `gcloud auth application-default login`

## Setup

### 1. Clone and install

```bash
git clone <repo>
cd BeautySalons
pnpm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

The defaults work with the Docker setup out of the box. No API key is needed. Authentication uses Application Default Credentials (ADC).

### 3. Start the database

```bash
docker compose up -d
```

### 4. Build shared types

```bash
pnpm --filter @beauty-salons/shared build
```

### 5. Seed the database

Run the full data pipeline first (see below), then seed:

```bash
pnpm --filter @beauty-salons/backend seed
```

### 6. Run the app

```bash
pnpm dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:3000

---

## Data pipeline

Required before seeding. Collected data is not included in the repository.

Ensure ADC is set up first: `gcloud auth application-default login`

```bash
# 1. Collect salons from Google Places API
pnpm collect

# 2. Cache photos locally (downloads to packages/frontend/public/photos/)
pnpm cache-photos

# 3. Re-seed the database
pnpm --filter @beauty-salons/backend seed
```

---

## Project structure

```
packages/
  shared/       # TypeScript interfaces shared between frontend and backend
  collector/    # One-shot script: queries Google Places API → salons.json
  backend/      # NestJS REST API
  frontend/     # React SPA
```

---

## Design decisions

### Data source: Google Places API (New)

Google Places provides the most complete and accurate data for Polish businesses &mdash; structured fields 
(address, phone, website, opening hours, price level), ratings with review counts, and photos with author attributions. 
The alternative would be scraping, which is fragile.

ADC is used instead of an API key so credentials are never embedded in source code or sent to the browser. 
The backend proxies photo requests via `/api/photos/*` for any references not yet cached locally.

### Data quality

- **Deduplication** by `placeId` &mdash; Google's stable identifier. Re-running the collector updates existing records rather than creating duplicates.
- **District extraction** &mdash; derived from the address via regex matching Warsaw district names, since the Places API doesn't return an administrative district field directly.
- **Services** &mdash; mapped from Google's place types (e.g. `nail_salon`, `hair_care`) to a normalised list.
- **Missing fields** &mdash; nullable throughout. The UI degrades gracefully when rating, phone, website, or photos are absent.
- **Raw data preserved** &mdash; the full API response is stored in `_raw` in `salons.json`, allowing the schema to be extended without re-collecting.

### Photo caching

Google's ToS (section 5e) permits caching content as long as cached copies are not kept longer than allowed by the cache headers on the response. 
Photos are downloaded once via `cache-photos` and served as static files from `public/photos/`. 
In a production setup this would move server-side &mdash; a background job would check cache header expiry and refresh photos accordingly, 
storing them in object storage rather than the local filesystem.

---

## Known limitations & what I'd improve with more time

- **Phone validation** &mdash; the edit form accepts any string. A proper implementation would validate format (e.g. E.164) and normalise Polish numbers.
- **Server-side photo caching** &mdash; currently photos are cached manually via CLI. A production version would have a background job that respects cache header expiry and refreshes photos automatically, storing them in object storage (S3/GCS) rather than the local filesystem.
- **No authentication** &mdash; the edit endpoint is open. Would add auth before any real deployment.
- **Coverage** &mdash; currently Warsaw only, queried district by district.

---

## How would you scale to all of Poland?

The current collector queries fixed district centre coordinates with a 2.5km radius. Scaling to all of Poland would require:

1. **City list** &mdash; a dataset of Polish cities/towns with coordinates (GUS provides this). Roughly 900 cities and thousands of smaller towns.
2. **Grid tiling** &mdash; for dense cities, a single radius query misses results. A hexagonal grid tiling (e.g. H3) ensures full coverage without excessive overlap.
3. **Quota management** &mdash; the Places API has per-minute and per-day quotas. The collector would need rate limiting, retry with backoff, and resumable state so interrupted runs don't restart from scratch.
4. **Incremental updates** &mdash; rather than re-collecting everything, track `lastCollectedAt` per area and re-query on a schedule (weekly or monthly).
5. **Deduplication across areas** &mdash; already handled by `placeId`, but a place near a tile boundary may be returned by multiple queries.