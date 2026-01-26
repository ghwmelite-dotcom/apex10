import { Hono } from "hono";
import type { Env, PriceData } from "../types";
import { CACHE_KEYS, CACHE_TTL } from "../types";

export const pricesRoutes = new Hono<{ Bindings: Env }>();

// CoinCap ID mapping for our assets (lowercase IDs)
const COINCAP_IDS: Record<string, string> = {
  XRP: "xrp",
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  AVAX: "avalanche",
  LINK: "chainlink",
  AAVE: "aave",
  UNI: "uniswap",
  ARB: "arbitrum",
  OP: "optimism",
  MATIC: "polygon",
};

// Base prices for mock data fallback
const BASE_PRICES: Record<string, number> = {
  XRP: 2.5,
  BTC: 67500,
  ETH: 3450,
  SOL: 185,
  AVAX: 42,
  LINK: 18.5,
  AAVE: 165,
  UNI: 12.5,
  ARB: 1.85,
  OP: 3.2,
  MATIC: 0.95,
};

// CoinCap API response types
interface CoinCapAsset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
}

interface CoinCapAssetsResponse {
  data: CoinCapAsset[];
  timestamp: number;
}

interface CoinCapHistoryPoint {
  priceUsd: string;
  time: number;
  date: string;
}

interface CoinCapHistoryResponse {
  data: CoinCapHistoryPoint[];
  timestamp: number;
}

// ============================================
// GET /api/prices/:symbols
// Returns live prices for specified symbols
// Symbols are comma-separated (e.g., BTC,ETH,SOL)
// ============================================
pricesRoutes.get("/:symbols", async (c) => {
  const symbolsParam = c.req.param("symbols");
  const symbols = symbolsParam.toUpperCase().split(",");
  const cacheKey = CACHE_KEYS.PRICES(symbols.sort().join(","));

  // Check cache
  const cached = await c.env.CACHE.get(cacheKey, "json");
  if (cached) {
    return c.json({
      data: cached,
      meta: { cached: true, cachedAt: new Date().toISOString() },
    });
  }

  // Map symbols to CoinCap IDs
  const ids = symbols
    .map((s) => COINCAP_IDS[s])
    .filter(Boolean)
    .join(",");

  if (!ids) {
    return c.json({ error: "No valid symbols provided" }, 400);
  }

  try {
    // Fetch from CoinCap API (free, no API key required)
    const response = await fetch(
      `https://api.coincap.io/v2/assets?ids=${ids}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinCap API error: ${response.status}`);
    }

    const data = (await response.json()) as CoinCapAssetsResponse;
    const prices = transformCoinCapData(data, symbols);

    // Cache results
    await c.env.CACHE.put(cacheKey, JSON.stringify(prices), {
      expirationTtl: CACHE_TTL.PRICES,
    });

    return c.json({ data: prices, meta: { cached: false } });
  } catch (error) {
    console.error("Price fetch error:", error);

    // Fall back to mock data on error
    const mockPrices = generateMockPrices(symbols);
    return c.json({
      data: mockPrices,
      meta: { cached: false, fallback: true },
    });
  }
});

// ============================================
// GET /api/prices/history/:symbol
// Returns price history for charting
// Query params: period (24h, 7d, 30d, 1y)
// ============================================
pricesRoutes.get("/history/:symbol", async (c) => {
  const symbol = c.req.param("symbol").toUpperCase();
  const period = (c.req.query("period") || "7d") as "24h" | "7d" | "30d" | "1y";
  const cacheKey = CACHE_KEYS.PRICE_HISTORY(symbol, period);

  // Check cache
  const cached = await c.env.CACHE.get(cacheKey, "json");
  if (cached) {
    return c.json({ data: cached, meta: { cached: true } });
  }

  const coincapId = COINCAP_IDS[symbol];
  if (!coincapId) {
    return c.json({ error: "Invalid symbol" }, 400);
  }

  // Map period to CoinCap interval and time range
  const periodConfig = {
    "24h": { interval: "m15", days: 1 },   // 15-minute intervals for 24h
    "7d": { interval: "h1", days: 7 },     // 1-hour intervals for 7d
    "30d": { interval: "h6", days: 30 },   // 6-hour intervals for 30d
    "1y": { interval: "d1", days: 365 },   // Daily intervals for 1y
  };

  const { interval, days } = periodConfig[period];
  const end = Date.now();
  const start = end - days * 24 * 60 * 60 * 1000;

  try {
    const response = await fetch(
      `https://api.coincap.io/v2/assets/${coincapId}/history?interval=${interval}&start=${start}&end=${end}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinCap API error: ${response.status}`);
    }

    const data = (await response.json()) as CoinCapHistoryResponse;

    const result = {
      symbol,
      period,
      prices: data.data.map((point) => ({
        timestamp: point.time,
        price: parseFloat(point.priceUsd),
      })),
    };

    // Cache results
    await c.env.CACHE.put(cacheKey, JSON.stringify(result), {
      expirationTtl: CACHE_TTL.PRICE_HISTORY,
    });

    return c.json({ data: result, meta: { cached: false } });
  } catch (error) {
    console.error("History fetch error:", error);

    // Generate mock data on error
    const mockHistory = generateMockHistory(days, symbol);
    return c.json({
      data: {
        symbol,
        period,
        prices: mockHistory.prices.map(([timestamp, price]) => ({
          timestamp,
          price,
        })),
      },
      meta: { cached: false, fallback: true },
    });
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function transformCoinCapData(
  data: CoinCapAssetsResponse,
  symbols: string[]
): Record<string, PriceData> {
  const result: Record<string, PriceData> = {};

  // Create a map of CoinCap ID to symbol for reverse lookup
  const idToSymbol: Record<string, string> = {};
  for (const [sym, id] of Object.entries(COINCAP_IDS)) {
    idToSymbol[id] = sym;
  }

  for (const asset of data.data) {
    const symbol = idToSymbol[asset.id];
    if (symbol && symbols.includes(symbol)) {
      result[symbol] = {
        symbol,
        priceUsd: parseFloat(asset.priceUsd),
        change24h: parseFloat(asset.changePercent24Hr) || 0,
        change7d: 0, // CoinCap doesn't provide 7d change directly
        marketCap: parseFloat(asset.marketCapUsd) || 0,
        volume24h: parseFloat(asset.volumeUsd24Hr) || 0,
        lastUpdated: new Date(data.timestamp).toISOString(),
      };
    }
  }

  return result;
}

function generateMockPrices(symbols: string[]): Record<string, PriceData> {
  const result: Record<string, PriceData> = {};

  for (const symbol of symbols) {
    const basePrice = BASE_PRICES[symbol] || 1;
    // Add some randomness
    const variance = (Math.random() - 0.5) * 0.02;
    const price = basePrice * (1 + variance);

    result[symbol] = {
      symbol,
      priceUsd: price,
      change24h: (Math.random() - 0.5) * 10,
      change7d: (Math.random() - 0.5) * 20,
      marketCap: price * (symbol === "BTC" ? 19_500_000 : 1_000_000),
      volume24h: price * 100_000,
      lastUpdated: new Date().toISOString(),
    };
  }

  return result;
}

function generateMockHistory(
  days: number,
  symbol?: string
): { prices: [number, number][] } {
  const prices: [number, number][] = [];
  const now = Date.now();
  const interval = (days * 24 * 60 * 60 * 1000) / 100; // 100 data points
  let price = symbol ? (BASE_PRICES[symbol] || 1) : 50000;

  for (let i = 0; i < 100; i++) {
    const timestamp = now - (100 - i) * interval;
    // Random walk
    price = price * (1 + (Math.random() - 0.5) * 0.02);
    prices.push([timestamp, price]);
  }

  return { prices };
}
