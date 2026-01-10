# Apex10

### The World's Most Immersive Crypto Education & Security Platform

<p align="center">
  <img src="public/favicon.svg" alt="Apex10 Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Security-First | AI-Powered | Web3 Native | Beautifully Crafted</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#security-tools">Security Tools</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#roadmap">Roadmap</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Three.js-3D-000000?logo=threedotjs&logoColor=white" alt="Three.js">
  <img src="https://img.shields.io/badge/AI-Llama%203.1-purple" alt="AI Powered">
  <img src="https://img.shields.io/badge/Web3-Polygon-8247E5?logo=polygon&logoColor=white" alt="Web3">
  <img src="https://img.shields.io/badge/PWA-Enabled-5A0FC8?logo=pwa&logoColor=white" alt="PWA">
</p>

---

## Overview

**Apex10** is not just another crypto dashboard—it's a complete educational and security platform designed to help users navigate the crypto universe safely and confidently. With cutting-edge visualizations, AI-powered guidance, Web3 security tools, and gamified learning, we're redefining what a crypto platform can be.

### Live Demo
🌐 **[apex10-cryptodiscover.ghwmelite.workers.dev](https://apex10-cryptodiscover.ghwmelite.workers.dev)**

---

## Features

### 📊 Core Experience

| Feature | Description |
|---------|-------------|
| **Top 10 Rankings** | Curated high-potential crypto assets with transparent methodology scoring Potential, Utility, Developer Activity, and Adoption |
| **Crypto News Hub** | Real-time aggregated news from 6 top sources with AI-powered text-to-speech reader |
| **Security Hub** | Comprehensive security education with interactive quizzes, phishing simulations, and best practices |
| **Learning Center** | Step-by-step guides for wallet setup, safe crypto acquisition, and avoiding common pitfalls |
| **3D Orbital View** | Stunning Three.js visualization showing assets orbiting in 3D space |

### 🔐 Security Tools

| Tool | Description |
|------|-------------|
| **Contract Scanner** | AI-powered smart contract security analysis. Detect honeypots, rugpulls, taxes, and malicious patterns across 5 chains |
| **Wallet Guardian** | Scan token approvals, detect risky permissions, and revoke unlimited allowances to protect your assets |
| **Phishing Simulator** | AI-generated realistic phishing scenarios to train your detection skills |
| **Security Training** | Interactive quizzes with certificate generation for completed courses |

### 📰 News Aggregator

| Feature | Description |
|---------|-------------|
| **6 Premium Sources** | CoinDesk, CoinTelegraph, The Block, Decrypt, CryptoSlate, Bitcoin Magazine |
| **Smart Categorization** | Auto-categorized into Market, DeFi, NFT, Regulation, Technology, Analysis |
| **Immersive Reader** | Full-screen distraction-free reading mode with progress tracking |
| **AI Text-to-Speech** | Listen to articles with adjustable speed (0.5x-2x), voice selection, and sentence highlighting |
| **AI Summaries** | Llama 3.1 powered article summarization |

### 🎨 Unique UI/UX

| Feature | Description |
|---------|-------------|
| **Custom Animated Cursor** | Smooth spring-physics cursor with glow trail |
| **Holographic Cards** | Rainbow shimmer effects with 3D tilt on hover |
| **Live Activity Feed** | Real-time simulated trading activity |
| **Sound Design System** | Subtle audio feedback using Web Audio API |
| **Confetti Celebrations** | Particle explosions for achievements |
| **Discovery Mode** | Guided onboarding experience |
| **Command Palette** | Quick navigation with `Cmd+K` / `Ctrl+K` |
| **Time-Aware UI** | Adaptive colors based on time of day |
| **Ambient Mode** | Relaxing screensaver mode with market visuals |
| **PWA Support** | Install as native app on mobile/desktop |

---

## Security Tools

### Contract Scanner

Analyze any smart contract for security risks:

```
Supported Chains: Ethereum, BSC, Polygon, Arbitrum, Base

Risk Factors Analyzed:
├── Honeypot Detection
├── Rug Pull Indicators
├── Buy/Sell Tax Analysis
├── Liquidity Analysis
├── Ownership Privileges
├── Minting Capability
└── Proxy Contract Detection
```

- **Risk Score**: 0-100 with color-coded severity levels
- **AI Explanation**: Human-readable summary from Llama 3.1
- **Educational Tips**: Learn why each factor matters

### Wallet Guardian

Protect your wallet from malicious approvals:

```
Features:
├── Scan All Token Approvals (ERC20, ERC721, ERC1155)
├── Identify Risky Spenders
├── Detect Unlimited Approvals
├── Check Contract Verification
├── One-Click Revoke
└── Security Score Grade (A-F)
```

---

## Tech Stack

### Frontend
- **React 18** - Latest React with concurrent features
- **TypeScript 5.6** - Full type safety
- **Vite 6** - Lightning-fast build tool
- **TailwindCSS** - Utility-first styling with Aurora Night theme
- **Framer Motion** - Physics-based animations
- **Three.js / React Three Fiber** - 3D visualizations
- **TanStack Query** - Intelligent data fetching
- **Wagmi + Viem** - Web3 wallet integration
- **Web Speech API** - Browser-native TTS

### Backend
- **Cloudflare Workers** - Edge computing (~50ms global latency)
- **Hono** - Lightweight, fast API framework (12KB)
- **D1 Database** - SQLite at the edge
- **Workers KV** - Global key-value cache
- **Workers AI (Llama 3.1)** - AI inference at the edge
- **R2 Storage** - Object storage for assets

### External APIs
- **CoinGecko** - Price data
- **GoPlus Security** - Token security analysis
- **DEXScreener** - Liquidity data
- **Block Explorers** - Contract verification (Etherscan, etc.)
- **RSS Feeds** - News aggregation

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  CLOUDFLARE GLOBAL EDGE                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│   │  React SPA   │    │   Hono API   │    │  Workers AI  │  │
│   │  (PWA)       │    │   /api/*     │    │  (Llama 3.1) │  │
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
├─────────────────────────────────────────────────────────────┤
│                    EXTERNAL SERVICES                         │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│   │CoinGecko │  │  GoPlus  │  │DEXScreener│  │RSS Feeds │   │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
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

### Environment Variables

```bash
# wrangler.jsonc vars section
COINGECKO_API_KEY=your_key        # Optional: for higher rate limits
ETHERSCAN_API_KEY=your_key        # For contract verification
POLYGONSCAN_API_KEY=your_key
BSCSCAN_API_KEY=your_key
ARBISCAN_API_KEY=your_key
BASESCAN_API_KEY=your_key
GOPLUS_API_KEY=your_key           # Optional: for security API
```

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
│   │   │   ├── scanner.ts      # Contract scanner
│   │   │   ├── walletGuardian.ts # Wallet approvals
│   │   │   ├── news.ts         # News aggregation
│   │   │   ├── ai.ts           # AI endpoints
│   │   │   └── admin.ts        # Admin dashboard
│   │   ├── services/
│   │   │   ├── contractScanner.ts
│   │   │   └── newsService.ts
│   │   └── types.ts            # Shared types
│   │
│   ├── components/
│   │   ├── ui/                 # Base UI components
│   │   ├── layout/             # Header, Footer, Layout
│   │   ├── news/               # News components
│   │   │   ├── ArticleCard.tsx
│   │   │   └── ImmersiveReader.tsx
│   │   ├── web3/               # Web3 components
│   │   │   └── WalletProvider.tsx
│   │   ├── OrbitalView.tsx     # 3D visualization
│   │   ├── HolographicCard.tsx # Rainbow effects
│   │   ├── AchievementSystem.tsx
│   │   ├── SecurityTraining.tsx
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx       # Main rankings view
│   │   ├── NewsHub.tsx         # News aggregator
│   │   ├── SecurityHub.tsx     # Security education
│   │   ├── ContractScanner.tsx # Contract analysis
│   │   ├── WalletGuardian.tsx  # Approval management
│   │   ├── LearnCenter.tsx     # Guides
│   │   └── NotFound.tsx        # Epic 404 page
│   │
│   ├── hooks/
│   │   ├── useNews.ts          # News data fetching
│   │   ├── useTextToSpeech.ts  # TTS hook
│   │   ├── useContractScanner.ts
│   │   └── ...
│   │
│   └── styles/
│       └── globals.css         # Aurora Night design system
│
├── db/
│   ├── schema.ts               # Drizzle schema
│   └── migrations/             # SQL migrations
│
├── public/
│   └── manifest.json           # PWA manifest
│
└── wrangler.jsonc              # Cloudflare config
```

---

## API Reference

### Assets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assets/top10` | Get top 10 ranked assets |
| GET | `/api/assets/:symbol` | Get asset details |

### Prices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/prices/:symbols` | Get live prices (comma-separated) |
| GET | `/api/prices/history/:symbol` | Get price history |

### News
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/news/feed` | Get paginated news feed |
| GET | `/api/news/article/:id` | Get single article |
| GET | `/api/news/sources` | List available sources |
| GET | `/api/news/categories` | Categories with counts |
| GET | `/api/news/trending` | Trending articles |
| POST | `/api/news/summarize` | AI-generated summary |

### Contract Scanner
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scanner/analyze/:chain/:address` | Full contract analysis |
| GET | `/api/scanner/quick/:chain/:address` | Quick risk check |

### Wallet Guardian
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wallet-guardian/approvals/:chain/:address` | Get all approvals |
| GET | `/api/wallet-guardian/risk/:address` | Get risk assessment |

### Security
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/security/checklist` | Security checklist |
| GET | `/api/security/threats` | Common threats |
| GET | `/api/security/best-practices` | Security tips |
| POST | `/api/security/quiz` | Generate AI quiz |
| POST | `/api/security/phishing-simulation` | Generate phishing test |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Chat with AI mentor |
| POST | `/api/ai/analyze` | AI analysis |

---

## Roadmap

### Phase 1: Foundation ✅
- [x] Top 10 rankings dashboard
- [x] Security hub with checklist
- [x] Learning center
- [x] 3D orbital visualization
- [x] Custom animated cursor
- [x] Holographic card effects
- [x] Sound design system
- [x] Discovery mode onboarding
- [x] PWA support
- [x] Performance optimization

### Phase 2: Security Tools ✅
- [x] Contract Scanner with AI analysis
- [x] Wallet Guardian approval scanner
- [x] AI-powered security quizzes
- [x] Phishing simulation training
- [x] Certificate generation

### Phase 3: News & Content ✅
- [x] Crypto news aggregator (6 sources)
- [x] AI text-to-speech reader
- [x] Immersive reading mode
- [x] AI article summarization
- [x] Category filtering

### Phase 4: Advanced Features (In Progress)
- [ ] Real-time WebSocket prices
- [ ] User authentication
- [ ] Portfolio tracking
- [ ] Price alerts
- [ ] Mobile app (React Native)
- [ ] Social sharing
- [ ] Community features

---

## Contributing

We welcome contributions! Please see our contributing guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to your fork (`git push origin feature/amazing-feature`)
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
- [GoPlus Security](https://gopluslabs.io) - Token security API
- [CoinGecko](https://coingecko.com) - Price data

---

<p align="center">
  <strong>Built with passion for the future of crypto education & security</strong>
  <br><br>
  <sub>Powered by Cloudflare Workers | ~50ms Global Latency | Infinite Scale</sub>
  <br>
  <sub>AI-Powered by Llama 3.1 | Web3 Native | PWA Enabled</sub>
</p>
