// ============================================
// ASSET TYPES
// ============================================
export interface Asset {
  id: number;
  symbol: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  shortDescription?: string;
  website?: string;
  whitepaper?: string;
  coingeckoId?: string;
  logoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RankedAsset {
  id: number;
  symbol: string;
  name: string;
  slug: string;
  category: string;
  shortDescription?: string;
  logoUrl?: string;
  coingeckoId?: string;
  rank: number;
  overallScore: number;
  potentialScore: number;
  utilityScore: number;
  developerScore: number;
  adoptionScore: number;
  riskLevel: "low" | "medium" | "high";
}

export interface AssetDetail extends RankedAsset {
  description: string;
  website?: string;
  whitepaper?: string;
  strengths?: string[];
  weaknesses?: string[];
  analysisNotes?: string;
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

export interface PriceHistoryPoint {
  timestamp: number;
  price: number;
}

export interface PriceHistory {
  symbol: string;
  period: "24h" | "7d" | "30d" | "1y";
  prices: PriceHistoryPoint[];
}

// ============================================
// RANKING TYPES
// ============================================
export interface RankingCriterion {
  name: string;
  weight: number;
  description: string;
  factors: string[];
}

export interface RankingMethodology {
  overview: string;
  lastUpdated: string;
  criteria: RankingCriterion[];
  riskLevels: RiskLevelInfo[];
  disclaimer: string;
}

export interface RiskLevelInfo {
  level: "low" | "medium" | "high";
  description: string;
  examples: string;
}

export interface CustomWeights {
  potentialWeight: number;
  utilityWeight: number;
  developerWeight: number;
  adoptionWeight: number;
}

// ============================================
// SECURITY TYPES
// ============================================
export interface SecurityTip {
  id: number;
  type: "tip";
  category: string;
  title: string;
  content: string;
  severity: "info" | "warning" | "critical";
  order: number;
}

export interface SecurityThreat {
  id: number;
  type: "threat";
  category: string;
  title: string;
  content: string;
  severity: "warning" | "critical";
  order: number;
}

export interface WalletGuide {
  id: number;
  type: "wallet_guide";
  category: "hardware" | "software";
  title: string;
  content: string;
  metadata?: {
    pros?: string[];
    cons?: string[];
    priceRange?: string;
  };
}

export interface AcquisitionGuide {
  id: number;
  type: "acquisition_guide";
  category: "centralized" | "decentralized" | "onramp";
  title: string;
  content: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  priority: "critical" | "high" | "medium";
}

export interface ChecklistCategory {
  name: string;
  items: ChecklistItem[];
}

export interface SecurityChecklist {
  categories: ChecklistCategory[];
}

// ============================================
// USER TYPES (Phase 2)
// ============================================
export interface User {
  id: number;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  preferences?: UserPreferences;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface UserPreferences {
  theme?: "dark" | "light";
  currency?: string;
  notifications?: boolean;
}

export interface WatchlistItem {
  id: number;
  userId: number;
  assetId: number;
  asset?: Asset;
  notes?: string;
  alertPrice?: number;
  addedAt: Date;
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
