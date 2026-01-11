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
  ADMIN_API_KEY?: string;
  // Web3 bindings
  POLYGON_RPC_URL?: string;
  RELAYER_PRIVATE_KEY?: string;
  CREDENTIAL_CONTRACT_ADDRESS?: string;
  WALLETCONNECT_PROJECT_ID?: string;
  // External API keys
  ETHERSCAN_API_KEY?: string;
  POLYGONSCAN_API_KEY?: string;
  BSCSCAN_API_KEY?: string;
  ARBISCAN_API_KEY?: string;
  BASESCAN_API_KEY?: string;
  GOPLUS_API_KEY?: string;
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
  // Scanner cache keys
  CONTRACT_ANALYSIS: (chain: string, address: string) =>
    `scanner:${chain}:${address.toLowerCase()}`,
  CONTRACT_QUICK: (chain: string, address: string) =>
    `scanner:quick:${chain}:${address.toLowerCase()}`,
  // Wallet guardian cache keys
  WALLET_APPROVALS: (chain: string, address: string) =>
    `guardian:approvals:${chain}:${address.toLowerCase()}`,
  WALLET_RISK: (address: string) => `guardian:risk:${address.toLowerCase()}`,
  GOPLUS_CHECK: (address: string) => `guardian:goplus:${address.toLowerCase()}`,
  // News cache keys
  NEWS_FEED: (category: string, source: string) => `news:feed:${category}:${source}`,
  NEWS_ARTICLE: (id: string) => `news:article:${id}`,
  NEWS_SOURCES: "news:sources",
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
  // Scanner cache TTLs
  CONTRACT_ANALYSIS: 300, // 5 minutes
  CONTRACT_QUICK: 60, // 1 minute
  // Wallet guardian cache TTLs
  WALLET_APPROVALS: 300, // 5 minutes
  WALLET_RISK: 600, // 10 minutes
  GOPLUS_CHECK: 3600, // 1 hour
  // News cache TTLs - shorter to keep content fresh
  NEWS_FEED: 900, // 15 minutes - ensures current news
  NEWS_ARTICLE: 3600, // 1 hour - individual articles
  NEWS_SOURCES: 21600, // 6 hours - sources rarely change
  NEWS_SUMMARY: 3600, // 1 hour - AI summaries
} as const;

// ============================================
// SCANNER TYPES
// ============================================
export type ChainId = "ethereum" | "bsc" | "polygon" | "arbitrum" | "base";

export interface RiskFactor {
  id: string;
  name: string;
  severity: "critical" | "high" | "medium" | "low" | "safe";
  detected: boolean;
  description: string;
  educationalTip: string;
}

export interface ContractAnalysisResult {
  address: string;
  chain: ChainId;
  riskScore: number;
  riskLevel: "critical" | "high" | "medium" | "low" | "safe";
  isVerified: boolean;
  tokenInfo: {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
  } | null;
  riskFactors: {
    honeypot: RiskFactor;
    rugPull: RiskFactor;
    taxes: RiskFactor;
    liquidity: RiskFactor;
    ownership: RiskFactor;
    mintable: RiskFactor;
    proxy: RiskFactor;
  };
  liquidityAnalysis: {
    totalLiquidityUsd: number;
    isLocked: boolean;
    lockDuration: string | null;
    lpPairs: Array<{
      pair: string;
      liquidityUsd: number;
      dex: string;
    }>;
  };
  taxAnalysis: {
    buyTax: number;
    sellTax: number;
    isHighTax: boolean;
  };
  aiExplanation: string;
  analyzedAt: string;
}

// ============================================
// WALLET GUARDIAN TYPES
// ============================================
export interface TokenApproval {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  spenderAddress: string;
  spenderName: string | null;
  approvalAmount: string;
  approvalTimestamp: number;
  txHash: string;
  type: "ERC20" | "ERC721" | "ERC1155";
}

export interface ApprovalRisk {
  approvalId: string;
  riskLevel: "critical" | "high" | "medium" | "low";
  riskScore: number;
  factors: {
    isKnownScam: boolean;
    isUnlimitedApproval: boolean;
    approvalAgeDays: number;
    isContractVerified: boolean;
    hasRecentDrains: boolean;
    spenderReputation: "trusted" | "unknown" | "suspicious" | "malicious";
  };
  aiExplanation: string;
  recommendation: "revoke_immediately" | "consider_revoking" | "monitor" | "safe";
}

export interface WalletSecurityScore {
  grade: "A" | "B" | "C" | "D" | "F";
  numericScore: number;
  breakdown: {
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    totalApprovals: number;
  };
}

// ============================================
// NEWS TYPES
// ============================================
export type NewsCategory = "market" | "defi" | "nft" | "regulation" | "technology" | "analysis" | "all";

export type NewsSource =
  | "coindesk"
  | "cointelegraph"
  | "theblock"
  | "decrypt"
  | "cryptoslate"
  | "bitcoinmagazine"
  | "all";

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image?: string;
  source: NewsSource;
  sourceName: string;
  sourceIcon?: string;
  author?: string;
  publishedAt: string;
  category: NewsCategory;
  tags?: string[];
  readingTime: number;
}

export interface NewsFeedResponse {
  articles: NewsArticle[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface NewsSourceInfo {
  id: NewsSource;
  name: string;
  icon: string;
  url: string;
  description: string;
}
