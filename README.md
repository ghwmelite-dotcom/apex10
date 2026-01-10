# Apex10

### The World's Most Immersive Crypto Education Platform

<p align="center">
  <img src="public/favicon.svg" alt="Apex10 Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Security-First | AI-Powered | Beautifully Crafted</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#roadmap">Roadmap</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Three.js-3D-000000?logo=threedotjs&logoColor=white" alt="Three.js">
  <img src="https://img.shields.io/badge/AI-Llama%203-purple" alt="AI Powered">
</p>

---

## Overview

**Apex10** is not just another crypto dashboard—it's a complete educational experience designed to help newcomers navigate the crypto universe safely and confidently. With cutting-edge visualizations, AI-powered guidance, and gamified learning, we're redefining what a crypto platform can be.

---

## Features

### Core Experience

| Feature | Description |
|---------|-------------|
| **Top 10 Rankings** | Curated high-potential crypto assets with transparent methodology scoring Potential, Utility, Developer Activity, and Adoption |
| **Security Hub** | Comprehensive security education with interactive checklists, threat awareness training, and best practices |
| **Learning Center** | Step-by-step guides for wallet setup, safe crypto acquisition, and avoiding common pitfalls |
| **3D Orbital View** | Stunning Three.js visualization showing assets orbiting in 3D space |

### Unique UI/UX

| Feature | Description |
|---------|-------------|
| **Custom Animated Cursor** | Smooth spring-physics cursor with glow trail that responds to interactive elements |
| **Holographic Cards** | Rainbow shimmer effects with 3D tilt on hover |
| **Live Activity Feed** | Real-time simulated trading activity to create market atmosphere |
| **Sound Design System** | Subtle audio feedback using Web Audio API for clicks, achievements, and transitions |
| **Confetti Celebrations** | Particle explosions and fireworks for completing achievements |
| **Scroll Animations** | Fade-in, parallax, and stagger effects as you scroll |
| **Spectacular 404 Page** | Floating astronaut in space with exploding "404" text |
| **Discovery Mode** | Guided onboarding experience with animated walkthrough |
| **Command Palette** | Quick navigation with `Cmd+K` / `Ctrl+K` |
| **Particle Backgrounds** | Ambient floating particles and orbs |

### Coming Soon (AI-Powered)

| Feature | Description |
|---------|-------------|
| **AI Crypto Mentor** | Llama 3-powered assistant for real-time crypto education |
| **Blockchain Visualizer** | Live transaction flow visualization |
| **Gamified Security Training** | Simulated phishing attacks and "Spot the Scam" games |
| **Voice Navigation** | "Hey Apex" voice commands |
| **Achievement System** | Unlockable badges and rewards |
| **Ambient Dashboard** | Screensaver mode with market-reactive visuals |
| **Time-Aware UI** | Adaptive colors based on time of day |
| **Personalized Learning** | AI-generated curriculum based on your level |
| **Portfolio Showcase** | Anonymous portfolio sharing with community |
| **Community Pulse** | Real-time sentiment and trending topics |

---

## Tech Stack

### Frontend
- **React 18** - Latest React with concurrent features
- **TypeScript 5.6** - Full type safety
- **Vite 6** - Lightning-fast build tool
- **TailwindCSS** - Utility-first styling with custom design system
- **Framer Motion** - Smooth, physics-based animations
- **Three.js / React Three Fiber** - 3D visualizations
- **TanStack Query** - Intelligent data fetching and caching

### Backend
- **Cloudflare Workers** - Edge computing with ~50ms global latency
- **Hono** - Lightweight, fast API framework (12KB)
- **D1 Database** - SQLite at the edge
- **Workers KV** - Global key-value cache
- **Workers AI (Llama 3)** - AI inference at the edge

### Design System
- Custom color palette (Aurora theme)
- Glass morphism effects
- Responsive from mobile to 4K

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  CLOUDFLARE GLOBAL EDGE                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│   │  React SPA   │    │   Hono API   │    │  Workers AI  │  │
│   │  (Vite SSG)  │    │   /api/*     │    │  (Llama 3)   │  │
│   └──────────────┘    └──────────────┘    └──────────────┘  │
│          │                   │                   │           │
│          └───────────────────┼───────────────────┘           │
│                              │                               │
│         ┌────────────────────┼────────────────────┐         │
│         ▼                    ▼                    ▼         │
│   ┌──────────┐        ┌──────────┐         ┌──────────┐    │
│   │    D1    │        │    KV    │         │    R2    │    │
│   │ Database │        │  Cache   │         │  Assets  │    │
│   └──────────┘        └──────────┘         └──────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- Cloudflare account (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/ghwmelite-dotcom/apex10.git
cd apex10

# Install dependencies
npm install

# Set up Cloudflare resources
npx wrangler login
npx wrangler d1 create apex10-db
npx wrangler kv:namespace create CACHE

# Update wrangler.jsonc with your IDs

# Run database migrations
npx wrangler d1 execute apex10-db --local --file=db/migrations/0001_initial.sql

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Deploy to Production

```bash
npm run build
npm run deploy
```

---

## Project Structure

```
apex10/
├── src/
│   ├── api/                    # Hono API routes
│   │   ├── routes/
│   │   │   ├── assets.ts       # Asset rankings
│   │   │   ├── prices.ts       # Live prices
│   │   │   ├── security.ts     # Security content
│   │   │   └── rankings.ts     # Methodology
│   │   └── index.ts
│   │
│   ├── components/
│   │   ├── ui/                 # Base UI components
│   │   ├── layout/             # Header, Footer, Layout
│   │   ├── OrbitalView.tsx     # 3D visualization
│   │   ├── CustomCursor.tsx    # Animated cursor
│   │   ├── HolographicCard.tsx # Rainbow effects
│   │   ├── LiveActivityFeed.tsx
│   │   ├── Confetti.tsx
│   │   ├── ScrollAnimations.tsx
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx       # Main rankings view
│   │   ├── SecurityHub.tsx     # Security education
│   │   ├── LearnCenter.tsx     # Guides
│   │   ├── AssetDetail.tsx     # Individual asset
│   │   └── NotFound.tsx        # Epic 404 page
│   │
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities
│   │   └── sounds.ts           # Audio system
│   └── styles/
│       └── globals.css         # Design system
│
├── db/
│   ├── schema.ts               # Drizzle schema
│   └── migrations/             # SQL migrations
│
├── wrangler.jsonc              # Cloudflare config
└── package.json
```

---

## API Endpoints

### Assets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assets/top10` | Get top 10 ranked assets |
| GET | `/api/assets/:symbol` | Get asset details |

### Prices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/prices/:symbols` | Get live prices (comma-separated) |

### Security
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/security/checklist` | Security checklist items |
| GET | `/api/security/threats` | Common threats |
| GET | `/api/security/best-practices` | Security tips |
| GET | `/api/security/wallets` | Wallet comparisons |

### Rankings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rankings/methodology` | Scoring methodology |

---

## Roadmap

### Phase 1: Foundation (Completed)
- [x] Top 10 rankings dashboard
- [x] Security hub with checklist
- [x] Learning center
- [x] 3D orbital visualization
- [x] Custom animated cursor
- [x] Holographic card effects
- [x] Sound design system
- [x] Confetti celebrations
- [x] Discovery mode onboarding
- [x] Scroll animations
- [x] Spectacular 404 page

### Phase 2: AI Integration (In Progress)
- [ ] AI Crypto Mentor (Llama 3)
- [ ] Interactive Blockchain Visualizer
- [ ] Gamified Security Training
- [ ] Voice-Controlled Navigation
- [ ] Achievement System with badges

### Phase 3: Community & Personalization
- [ ] Ambient Dashboard Mode
- [ ] Time-Aware Adaptive UI
- [ ] Personalized Learning Paths
- [ ] Anonymous Portfolio Showcase
- [ ] Live Community Pulse

### Phase 4: Advanced Features
- [ ] Real-time WebSocket prices
- [ ] User authentication
- [ ] Portfolio tracking
- [ ] Price alerts
- [ ] Mobile app

---

## Contributing

We welcome contributions! Please see our contributing guidelines.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your fork
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [Cloudflare](https://cloudflare.com) - Edge computing platform
- [Hono](https://hono.dev) - Fast web framework
- [React](https://react.dev) - UI library
- [Three.js](https://threejs.org) - 3D graphics
- [Framer Motion](https://framer.com/motion) - Animation library
- [TailwindCSS](https://tailwindcss.com) - CSS framework

---

<p align="center">
  <strong>Built with passion for the future of crypto education</strong>
  <br><br>
  <sub>Powered by Cloudflare Workers | ~50ms Global Latency | Infinite Scale</sub>
</p>
