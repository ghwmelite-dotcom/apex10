# 🚀 CryptoDiscover

**Edge-Native Crypto Asset Discovery Platform**

Built with React + Vite + Cloudflare Workers - the optimal 2025/2026 full-stack architecture.

![License](https://img.shields.io/badge/license-MIT-green)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)

---

## ✨ Features

- **📊 Top 10 Rankings** - Curated high-potential crypto assets with transparent methodology
- **🔒 Security Hub** - Comprehensive security education (wallets, threats, best practices)
- **📚 Learn Center** - Step-by-step guides for safe crypto acquisition
- **⚡ Edge-Powered** - ~50ms global latency via Cloudflare's 300+ data centers
- **🎨 Beautiful UI** - Dark theme with smooth animations (Framer Motion)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 CLOUDFLARE EDGE NETWORK                  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐     ┌─────────────────────────┐   │
│  │  Static Assets  │     │      Hono API           │   │
│  │  (React SPA)    │     │  /api/assets            │   │
│  │                 │     │  /api/security          │   │
│  │  Vite Build     │     │  /api/prices            │   │
│  └─────────────────┘     │  /api/rankings          │   │
│                          └─────────────────────────┘   │
│                                    │                    │
│            ┌───────────────────────┼───────────┐       │
│            ▼                       ▼           ▼       │
│     ┌──────────┐           ┌──────────┐  ┌─────────┐  │
│     │    D1    │           │    KV    │  │   R2    │  │
│     │ Database │           │  Cache   │  │ Storage │  │
│     └──────────┘           └──────────┘  └─────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Cloudflare Workers (V8 isolates) |
| **Frontend** | React 18 + TypeScript |
| **Build** | Vite 6 + @cloudflare/vite-plugin |
| **API** | Hono (Express-like, 12KB) |
| **Database** | D1 (SQLite at edge) |
| **ORM** | Drizzle ORM |
| **Cache** | Workers KV |
| **Styling** | Tailwind CSS |
| **Animation** | Framer Motion |
| **Data Fetching** | TanStack Query |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Cloudflare account (free tier works!)
- Wrangler CLI

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/crypto-discover.git
cd crypto-discover
npm install
```

### 2. Set Up Cloudflare Resources

```bash
# Login to Cloudflare
npx wrangler login

# Create D1 database
npx wrangler d1 create crypto-discover-db
# Copy the database_id to wrangler.jsonc

# Create KV namespace
npx wrangler kv:namespace create CACHE
# Copy the namespace id to wrangler.jsonc
```

### 3. Update Configuration

Edit `wrangler.jsonc` with your IDs:

```jsonc
{
  "d1_databases": [{
    "binding": "DB",
    "database_name": "crypto-discover-db",
    "database_id": "YOUR_D1_DATABASE_ID"  // ← Update this
  }],
  "kv_namespaces": [{
    "binding": "CACHE",
    "id": "YOUR_KV_NAMESPACE_ID"          // ← Update this
  }]
}
```

### 4. Run Database Migrations

```bash
# Local development
npx wrangler d1 execute crypto-discover-db --local --file=db/migrations/0001_init.sql

# Production (after first deploy)
npx wrangler d1 execute crypto-discover-db --remote --file=db/migrations/0001_init.sql
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) - you're running in the actual Workers runtime! 🎉

### 6. Deploy to Production

```bash
npm run build
npm run deploy
```

---

## 📁 Project Structure

```
crypto-cloudflare/
├── src/
│   ├── api/                    # Backend (Hono API)
│   │   ├── index.ts            # Main entry point
│   │   └── routes/
│   │       ├── assets.ts       # /api/assets/*
│   │       ├── security.ts     # /api/security/*
│   │       ├── prices.ts       # /api/prices/*
│   │       └── rankings.ts     # /api/rankings/*
│   │
│   ├── pages/                  # React pages
│   │   ├── Dashboard.tsx       # Top 10 rankings
│   │   ├── AssetDetail.tsx     # Individual asset
│   │   ├── SecurityHub.tsx     # Security education
│   │   └── LearnCenter.tsx     # How-to guides
│   │
│   ├── components/             # Reusable components
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript types
│   ├── App.tsx                 # Root component
│   └── main.tsx                # Entry point
│
├── db/
│   ├── schema.ts               # Drizzle schema
│   └── migrations/             # SQL migrations
│
├── wrangler.jsonc              # Cloudflare config
├── vite.config.ts              # Vite config
├── tailwind.config.js          # Tailwind config
└── package.json
```

---

## 🔌 API Endpoints

### Assets
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/assets/top10` | GET | Get top 10 ranked assets |
| `/api/assets/:symbol` | GET | Get detailed asset info |
| `/api/assets/meta/categories` | GET | List asset categories |

### Security
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/security/best-practices` | GET | Security tips |
| `/api/security/threats` | GET | Common threats |
| `/api/security/wallets` | GET | Wallet comparison |
| `/api/security/acquisition-guide` | GET | How to buy guide |
| `/api/security/checklist` | GET | Security checklist |

### Prices
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/prices/:symbols` | GET | Live prices (comma-separated) |
| `/api/prices/history/:symbol` | GET | Price history |

### Rankings
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rankings/methodology` | GET | Ranking explanation |
| `/api/rankings/history` | GET | Ranking changes |
| `/api/rankings/categories` | GET | Category breakdown |
| `/api/rankings/custom` | POST | Custom weighting |

---

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `COINGECKO_API_KEY` | CoinGecko API key for live prices | Optional |
| `ENVIRONMENT` | `development` or `production` | Auto-set |

Set secrets:
```bash
npx wrangler secret put COINGECKO_API_KEY
```

---

## 📊 Caching Strategy

| Data Type | Location | TTL | Rationale |
|-----------|----------|-----|-----------|
| Price data | KV | 30s | Balance freshness vs API limits |
| Top 10 list | KV | 5min | Changes infrequently |
| Security content | D1 | 1hr | Static educational content |
| User watchlists | D1 | None | Must be fresh |

---

## 💰 Cost Estimate

### Free Tier (covers most projects)
- Workers: 100K requests/day ✓
- D1: 5GB storage, 5M reads/day ✓
- KV: 100K reads/day ✓
- R2: 10GB storage ✓

### At Scale (~1M users)
- Estimated: **$25-50/month**

---

## 🚀 Deployment Options

### Option 1: Wrangler CLI (Recommended)
```bash
npm run deploy
```

### Option 2: GitHub Actions CI/CD
```yaml
# .github/workflows/deploy.yml
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

### Option 3: Git Integration
Connect your repo in the Cloudflare dashboard for automatic deployments.

---

## 🔒 Security Notes

- All API responses include security headers (via Hono middleware)
- CORS configured for specific origins
- No user authentication in MVP (add via Cloudflare Access or custom JWT)
- Rate limiting implemented via KV
- Input validation with Zod schemas

---

## 🛣️ Roadmap

### Phase 1 (Current) ✅
- [x] Top 10 dashboard
- [x] Asset detail pages
- [x] Security hub
- [x] Learn center
- [x] Sample data

### Phase 2
- [ ] Real CoinGecko integration
- [ ] Live WebSocket prices
- [ ] User authentication
- [ ] Watchlist feature

### Phase 3
- [ ] Price alerts
- [ ] Portfolio tracking (read-only)
- [ ] News aggregation
- [ ] Mobile app (React Native)

---

## 📝 License

MIT License - feel free to use for your own projects!

---

## 🙏 Acknowledgments

- [Cloudflare](https://cloudflare.com) - Amazing edge platform
- [Hono](https://hono.dev) - Lightweight web framework
- [Drizzle](https://orm.drizzle.team) - TypeScript ORM
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Framer Motion](https://www.framer.com/motion/) - Animations

---

<p align="center">
  <strong>Built with ❤️ on Cloudflare's Global Edge Network</strong>
  <br>
  <sub>~50ms latency worldwide | Zero cold starts | Infinite scale</sub>
</p>
