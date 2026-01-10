# 🚀 CryptoDiscover: Edge-Native Architecture
## The Definitive Guide to Building on Cloudflare

---

## Executive Summary

This document presents the **optimal architecture** for building a high-potential crypto asset discovery platform using **React + Vite + Cloudflare**. By leveraging Cloudflare's edge computing capabilities, we achieve:

- **~50ms global latency** (edge computing in 300+ cities)
- **Zero cold starts** (Workers are always warm)
- **Infinite scalability** (auto-scaling to millions of requests)
- **Minimal operational cost** (generous free tiers)
- **Single deployment** (frontend + backend unified)

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE EDGE NETWORK                                │
│                     (300+ Global Data Centers)                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                    CLOUDFLARE WORKER                                     │ │
│  │  ┌─────────────────────┐    ┌──────────────────────────────────────┐   │ │
│  │  │   Static Assets     │    │         Hono API Router              │   │ │
│  │  │   (React + Vite)    │    │  ┌────────────────────────────────┐ │   │ │
│  │  │                     │    │  │ /api/assets      → Rankings    │ │   │ │
│  │  │  • index.html       │    │  │ /api/security    → Education   │ │   │ │
│  │  │  • main.js          │    │  │ /api/prices      → Live Data   │ │   │ │
│  │  │  • styles.css       │    │  │ /api/watchlist   → User Data   │ │   │ │
│  │  │  • assets/*         │    │  └────────────────────────────────┘ │   │ │
│  │  └─────────────────────┘    └──────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│                    ┌─────────────────┼─────────────────┐                     │
│                    ▼                 ▼                 ▼                     │
│  ┌──────────────────────┐ ┌──────────────────┐ ┌────────────────────────┐   │
│  │     D1 Database      │ │   Workers KV     │ │     R2 Bucket          │   │
│  │   (SQLite Edge)      │ │   (Cache Layer)  │ │   (Asset Storage)      │   │
│  │                      │ │                  │ │                        │   │
│  │ • assets             │ │ • API responses  │ │ • User uploads         │   │
│  │ • rankings           │ │ • Price data     │ │ • Static images        │   │
│  │ • users              │ │ • Session data   │ │ • Documentation        │   │
│  │ • watchlists         │ │ • Rate limits    │ │                        │   │
│  │ • security_content   │ │                  │ │                        │   │
│  └──────────────────────┘ └──────────────────┘ └────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                    ┌──────────────────────────────────┐
                    │      EXTERNAL APIs               │
                    │  • CoinGecko (price data)        │
                    │  • DeFiLlama (TVL metrics)       │
                    │  • GitHub API (dev activity)     │
                    └──────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Core Technologies

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Runtime** | Cloudflare Workers | Edge compute (V8 isolates) |
| **Frontend** | React 18 + TypeScript | UI framework |
| **Build Tool** | Vite + @cloudflare/vite-plugin | Development & bundling |
| **API Framework** | Hono | Express-like routing for Workers |
| **Database** | Cloudflare D1 | SQLite at the edge |
| **ORM** | Drizzle ORM | Type-safe SQL queries |
| **Cache** | Workers KV | Global key-value cache |
| **Storage** | R2 | Object storage (S3-compatible) |
| **Styling** | Tailwind CSS | Utility-first CSS |

### Why This Stack?

1. **Cloudflare Vite Plugin (GA April 2025)**
   - Runs dev server in actual Workers runtime (workerd)
   - Full HMR support with real edge behavior
   - Single deployment for frontend + backend

2. **Hono Framework**
   - Built by Cloudflare team member
   - 12KB minified, ultra-fast
   - First-class Workers support
   - Express-like DX with type safety

3. **D1 + Drizzle ORM**
   - SQLite at the edge (low latency)
   - Type-safe queries with Drizzle
   - Automatic migrations
   - 5GB free storage

4. **Workers KV for Caching**
   - Cache external API responses (CoinGecko)
   - 60-second global propagation
   - Perfect for read-heavy price data

---

## 📁 Project Structure

```
crypto-cloudflare/
├── src/
│   ├── api/                      # Backend (Hono API)
│   │   ├── index.ts              # Main API entry point
│   │   ├── routes/
│   │   │   ├── assets.ts         # /api/assets endpoints
│   │   │   ├── security.ts       # /api/security endpoints
│   │   │   ├── prices.ts         # /api/prices (cached)
│   │   │   └── watchlist.ts      # /api/watchlist (user data)
│   │   ├── middleware/
│   │   │   ├── cache.ts          # KV caching middleware
│   │   │   └── rateLimit.ts      # Rate limiting
│   │   └── services/
│   │       ├── coingecko.ts      # External API service
│   │       └── rankings.ts       # Ranking algorithm
│   │
│   ├── components/               # React components
│   │   ├── ui/                   # Design system
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Badge.tsx
│   │   ├── AssetCard.tsx
│   │   ├── PriceChart.tsx
│   │   ├── SecurityChecklist.tsx
│   │   └── WalletGuide.tsx
│   │
│   ├── pages/                    # Page components
│   │   ├── Dashboard.tsx
│   │   ├── AssetDetail.tsx
│   │   ├── SecurityHub.tsx
│   │   └── LearnCenter.tsx
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAssets.ts
│   │   ├── usePrices.ts
│   │   └── useWatchlist.ts
│   │
│   ├── lib/                      # Utilities
│   │   ├── api.ts                # API client
│   │   └── utils.ts              # Helper functions
│   │
│   ├── types/                    # TypeScript types
│   │   └── index.ts
│   │
│   ├── App.tsx                   # Root React component
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles
│
├── db/
│   ├── schema.ts                 # Drizzle schema
│   └── migrations/               # SQL migrations
│
├── public/                       # Static assets
├── wrangler.jsonc                # Cloudflare config
├── vite.config.ts                # Vite config
├── drizzle.config.ts             # Drizzle config
├── tailwind.config.js            # Tailwind config
├── tsconfig.json                 # TypeScript config
└── package.json
```

---

## 🔧 Configuration Files

### wrangler.jsonc (Cloudflare Configuration)
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "crypto-discover",
  "main": "src/api/index.ts",
  "compatibility_date": "2025-01-01",
  "compatibility_flags": ["nodejs_compat"],
  
  // Static assets (React SPA)
  "assets": {
    "directory": "./dist/client",
    "binding": "ASSETS",
    "not_found_handling": "single-page-application"
  },
  
  // D1 Database
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "crypto-discover-db",
      "database_id": "<YOUR_D1_DATABASE_ID>"
    }
  ],
  
  // KV Namespaces (Cache)
  "kv_namespaces": [
    {
      "binding": "CACHE",
      "id": "<YOUR_KV_NAMESPACE_ID>"
    }
  ],
  
  // Environment Variables
  "vars": {
    "ENVIRONMENT": "production"
  },
  
  // Smart Placement (route to optimal edge)
  "placement": {
    "mode": "smart"
  }
}
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    cloudflare()
  ],
  build: {
    outDir: 'dist/client',
    sourcemap: true
  }
});
```

---

## 💾 Database Schema (Drizzle ORM)

```typescript
// db/schema.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const assets = sqliteTable('assets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  symbol: text('symbol').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  website: text('website'),
  coingeckoId: text('coingecko_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const rankings = sqliteTable('rankings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  assetId: integer('asset_id').references(() => assets.id),
  rank: integer('rank').notNull(),
  potentialScore: real('potential_score').notNull(),
  utilityScore: real('utility_score'),
  developerScore: real('developer_score'),
  adoptionScore: real('adoption_score'),
  riskLevel: text('risk_level'), // low, medium, high
  keyStrengths: text('key_strengths'), // JSON array
  calculatedAt: integer('calculated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const securityContent = sqliteTable('security_content', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(), // tip, threat, wallet, guide
  category: text('category'),
  title: text('title').notNull(),
  content: text('content').notNull(), // JSON
  priority: text('priority'), // critical, high, medium, low
  order: integer('order'),
});

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const watchlists = sqliteTable('watchlists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  assetId: integer('asset_id').references(() => assets.id),
  addedAt: integer('added_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
```

---

## 🚀 API Design (Hono)

### Main API Entry Point
```typescript
// src/api/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { cache } from 'hono/cache';

import { assets } from './routes/assets';
import { security } from './routes/security';
import { prices } from './routes/prices';
import { watchlist } from './routes/watchlist';

type Bindings = {
  DB: D1Database;
  CACHE: KVNamespace;
  COINGECKO_API_KEY?: string;
};

const api = new Hono<{ Bindings: Bindings }>()
  .basePath('/api')
  .use('*', logger())
  .use('*', cors())
  .route('/assets', assets)
  .route('/security', security)
  .route('/prices', prices)
  .route('/watchlist', watchlist);

export default api;
```

---

## ⚡ Caching Strategy

### KV Cache Middleware
```typescript
// src/api/middleware/cache.ts
import { Context, Next } from 'hono';

interface CacheOptions {
  ttl: number;       // Time to live in seconds
  prefix?: string;   // Cache key prefix
}

export function kvCache(options: CacheOptions) {
  return async (c: Context, next: Next) => {
    const cacheKey = `${options.prefix || ''}:${c.req.url}`;
    
    // Try to get from cache
    const cached = await c.env.CACHE.get(cacheKey, 'json');
    if (cached) {
      return c.json(cached);
    }
    
    // Execute handler
    await next();
    
    // Cache the response
    const response = c.res.clone();
    const data = await response.json();
    await c.env.CACHE.put(cacheKey, JSON.stringify(data), {
      expirationTtl: options.ttl
    });
  };
}
```

### Caching Tiers
| Data Type | Cache Location | TTL | Rationale |
|-----------|---------------|-----|-----------|
| Price data | KV | 30 seconds | Balance freshness vs API limits |
| Top 10 rankings | KV | 5 minutes | Changes infrequently |
| Security content | D1 + Edge | 1 hour | Static educational content |
| User watchlists | D1 | No cache | User-specific, must be fresh |

---

## 🎨 Frontend Architecture

### Data Fetching with TanStack Query
```typescript
// src/hooks/useAssets.ts
import { useQuery } from '@tanstack/react-query';

export function useTop10Assets() {
  return useQuery({
    queryKey: ['assets', 'top10'],
    queryFn: async () => {
      const res = await fetch('/api/assets/top10');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    staleTime: 60_000,        // Consider fresh for 1 minute
    refetchInterval: 30_000,  // Refetch every 30 seconds
  });
}
```

### Real-Time Price Updates
```typescript
// src/hooks/usePrices.ts
export function useLivePrices(symbols: string[]) {
  return useQuery({
    queryKey: ['prices', symbols],
    queryFn: () => fetchPrices(symbols),
    refetchInterval: 10_000,  // Every 10 seconds
    refetchIntervalInBackground: true,
  });
}
```

---

## 📊 Performance Optimizations

### 1. Edge-First Data Flow
```
User Request (Tokyo)
    │
    ▼
┌────────────────┐     Cache Hit?     ┌─────────────┐
│ Tokyo Edge     │ ───────YES───────▶ │ Return from │
│ (Cloudflare)   │                    │ KV Cache    │
└────────────────┘                    └─────────────┘
    │ Cache Miss
    ▼
┌────────────────┐
│ D1 Query       │ ◀── SQLite at edge
└────────────────┘
    │ Need external data?
    ▼
┌────────────────┐
│ CoinGecko API  │ ◀── Cached result stored in KV
└────────────────┘
```

### 2. Static Asset Optimization
- Vite code-splitting for lazy loading
- Brotli compression on Workers
- Immutable asset caching headers
- Critical CSS inlining

### 3. Database Optimization
- D1 read replicas auto-distribute globally
- Prepared statements for type safety
- Indexed queries on frequently accessed columns

---

## 🔐 Security Considerations

### API Security
```typescript
// Rate limiting with KV
async function rateLimit(c: Context, key: string, limit: number, window: number) {
  const count = await c.env.CACHE.get(`ratelimit:${key}`, 'json') || 0;
  if (count >= limit) {
    throw new HTTPException(429, { message: 'Too many requests' });
  }
  await c.env.CACHE.put(`ratelimit:${key}`, JSON.stringify(count + 1), {
    expirationTtl: window
  });
}
```

### Content Security
- Strict CSP headers
- CORS configuration
- Input validation with Zod
- SQL injection prevention (Drizzle ORM)

---

## 🚀 Deployment Workflow

### Local Development
```bash
# Install dependencies
npm install

# Create D1 database
npx wrangler d1 create crypto-discover-db

# Create KV namespace
npx wrangler kv:namespace create CACHE

# Run migrations
npx wrangler d1 execute crypto-discover-db --local --file=db/migrations/0001_init.sql

# Start dev server (runs in Workers runtime!)
npm run dev
```

### Production Deployment
```bash
# Build & Deploy
npm run build
npx wrangler deploy

# Run remote migrations
npx wrangler d1 execute crypto-discover-db --remote --file=db/migrations/0001_init.sql
```

### CI/CD with GitHub Actions
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

---

## 💰 Cost Analysis

### Free Tier Limits (Generous!)
| Service | Free Tier | Our Usage Estimate |
|---------|-----------|-------------------|
| Workers | 100K requests/day | ~50K/day |
| D1 | 5GB storage, 5M reads/day | ~500MB, ~1M reads |
| KV | 100K reads/day, 1GB storage | ~80K reads, ~50MB |
| R2 | 10GB storage, 10M reads/month | ~1GB, ~100K reads |

**Estimated Cost**: $0/month for moderate traffic
**At Scale (1M users)**: ~$25-50/month

---

## 🎯 Summary: Why This Architecture Wins

1. **Single Deployment**: Frontend + Backend in one Worker
2. **Global Performance**: Edge computing = ~50ms latency worldwide
3. **Zero Operations**: No servers to manage, auto-scaling
4. **Type-Safe**: TypeScript end-to-end with Drizzle
5. **Developer Experience**: Hot reload with real edge behavior
6. **Cost Efficient**: Free tier covers most startups
7. **Future-Proof**: Built on Cloudflare's latest (2025) stack

---

*This architecture represents the state-of-the-art for building modern, globally-distributed web applications in 2025.*
