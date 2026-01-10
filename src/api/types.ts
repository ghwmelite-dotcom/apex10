import type { D1Database, KVNamespace, R2Bucket, Ai } from "@cloudflare/workers-types";

// ============================================
// CLOUDFLARE BINDINGS
// ============================================
export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  STORAGE: R2Bucket;
  AI: Ai;
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  ENVIRONMENT: string;
  COINGECKO_API_KEY?: string;
}

// ============================================
// AI TYPES
// ============================================
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIChatRequest {
  messages: ChatMessage[];
  context?: "general" | "security" | "trading" | "defi" | "nft";
}

export interface AIChatResponse {
  response: string;
  model: string;
  tokensUsed?: number;
}

export interface AIAnalysisRequest {
  type: "asset" | "security" | "market";
  data: Record<string, unknown>;
}

export interface SecurityQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  category: "phishing" | "wallet" | "scam" | "general";
}

export interface PhishingSimulation {
  id: string;
  type: "email" | "website" | "message";
  content: string;
  isPhishing: boolean;
  redFlags: string[];
  explanation: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "learning" | "security" | "engagement" | "mastery";
  xpReward: number;
  unlockedAt?: string;
}

export interface UserProgress {
  id: string;
  visitorId: string;
  xp: number;
  level: number;
  achievements: string[];
  completedLessons: string[];
  securityScore: number;
  streak: number;
  lastActive: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    cached?: boolean;
    cachedAt?: string;
  };
}

export interface ApiError {
  error: string;
  message?: string;
  code?: string;
}

// ============================================
// PRICE TYPES
// ============================================
export interface PriceData {
  symbol: string;
  priceUsd: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: string;
}

export interface PriceHistory {
  symbol: string;
  prices: Array<{
    timestamp: number;
    price: number;
  }>;
  period: "24h" | "7d" | "30d" | "1y";
}

// ============================================
// COINGECKO TYPES
// ============================================
export interface CoinGeckoPrice {
  [id: string]: {
    usd: number;
    usd_24h_change?: number;
    usd_7d_change?: number;
    usd_market_cap?: number;
    usd_24h_vol?: number;
    last_updated_at?: number;
  };
}

export interface CoinGeckoMarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// ============================================
// CACHE KEYS
// ============================================
export const CACHE_KEYS = {
  TOP_10: "assets:top10",
  PRICES: (symbols: string) => `prices:${symbols}`,
  PRICE_HISTORY: (symbol: string, period: string) => `history:${symbol}:${period}`,
  SECURITY_CONTENT: (type: string) => `security:${type}`,
  RANKINGS_METHODOLOGY: "rankings:methodology",
} as const;

// ============================================
// CACHE TTL (in seconds)
// ============================================
export const CACHE_TTL = {
  PRICES: 60, // Minimum KV TTL is 60 seconds
  TOP_10: 300, // 5 minutes
  PRICE_HISTORY: 300,
  SECURITY_CONTENT: 3600, // 1 hour
  RANKINGS: 600, // 10 minutes
} as const;
