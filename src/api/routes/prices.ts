import { Hono } from "hono";
import type { Env, PriceData, CoinGeckoPrice, CoinGeckoMarketChart } from "../types";
import { CACHE_KEYS, CACHE_TTL } from "../types";

export const pricesRoutes = new Hono<{ Bindings: Env }>();

// CoinGecko ID mapping for our assets
const COINGECKO_IDS: Record<string, string> = {
  XRP: "ripple",
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  AVAX: "avalanche-2",
  LINK: "chainlink",
  AAVE: "aave",
  UNI: "uniswap",
  ARB: "arbitrum",
  OP: "optimism",
  MATIC: "matic-network",
};

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

  // Map symbols to CoinGecko IDs
  const ids = symbols
    .map((s) => COINGECKO_IDS[s])
    .filter(Boolean)
    .join(",");

  if (!ids) {
    return c.json({ error: "No valid symbols provided" }, 400);
  }

  try {
    // Fetch from CoinGecko (or use mock data if no API key)
    let prices: Record<string, PriceData>;

    if (c.env.COINGECKO_API_KEY) {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_7d_change=true&include_market_cap=true&include_24hr_vol=true&include_last_updated_at=true`,
        {
          headers: {
            "x-cg-demo-api-key": c.env.COINGECKO_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = (await response.json()) as CoinGeckoPrice;
      prices = transformCoinGeckoData(data, symbols);
    } else {
      // Mock data for development
      prices = generateMockPrices(symbols);
    }

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

  const coingeckoId = COINGECKO_IDS[symbol];
  if (!coingeckoId) {
    return c.json({ error: "Invalid symbol" }, 400);
  }

  const daysMap = { "24h": 1, "7d": 7, "30d": 30, "1y": 365 };
  const days = daysMap[period];

  try {
    let history: { prices: [number, number][] };

    if (c.env.COINGECKO_API_KEY) {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coingeckoId}/market_chart?vs_currency=usd&days=${days}`,
        {
          headers: {
            "x-cg-demo-api-key": c.env.COINGECKO_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      history = (await response.json()) as CoinGeckoMarketChart;
    } else {
      // Generate mock history
      history = generateMockHistory(days, symbol);
    }

    const result = {
      symbol,
      period,
      prices: history.prices.map(([timestamp, price]) => ({
        timestamp,
        price,
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

function transformCoinGeckoData(
  data: CoinGeckoPrice,
  symbols: string[]
): Record<string, PriceData> {
  const result: Record<string, PriceData> = {};

  for (const symbol of symbols) {
    const id = COINGECKO_IDS[symbol];
    const coinData = data[id];

    if (coinData) {
      result[symbol] = {
        symbol,
        priceUsd: coinData.usd,
        change24h: coinData.usd_24h_change || 0,
        change7d: coinData.usd_7d_change || 0,
        marketCap: coinData.usd_market_cap || 0,
        volume24h: coinData.usd_24h_vol || 0,
        lastUpdated: new Date(
          (coinData.last_updated_at || Date.now() / 1000) * 1000
        ).toISOString(),
      };
    }
  }

  return result;
}

function generateMockPrices(symbols: string[]): Record<string, PriceData> {
  const basePrices: Record<string, number> = {
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

  const result: Record<string, PriceData> = {};

  for (const symbol of symbols) {
    const basePrice = basePrices[symbol] || 1;
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

function generateMockHistory(days: number, symbol?: string): { prices: [number, number][] } {
  const basePrices: Record<string, number> = {
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

  const prices: [number, number][] = [];
  const now = Date.now();
  const interval = (days * 24 * 60 * 60 * 1000) / 100; // 100 data points
  let price = symbol ? (basePrices[symbol] || 1) : 50000;

  for (let i = 0; i < 100; i++) {
    const timestamp = now - (100 - i) * interval;
    // Random walk
    price = price * (1 + (Math.random() - 0.5) * 0.02);
    prices.push([timestamp, price]);
  }

  return { prices };
}
