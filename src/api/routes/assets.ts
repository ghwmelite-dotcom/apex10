import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq, asc } from "drizzle-orm";
import { assets, rankings } from "../../../db/schema";
import type { Env } from "../types";
import { CACHE_KEYS, CACHE_TTL } from "../types";

export const assetsRoutes = new Hono<{ Bindings: Env }>();

// ============================================
// GET /api/assets/top10
// Returns top 10 ranked assets with scores
// ============================================
assetsRoutes.get("/top10", async (c) => {
  const cacheKey = CACHE_KEYS.TOP_10;

  // Check cache first
  const cached = await c.env.CACHE.get(cacheKey, "json");
  if (cached) {
    return c.json({
      data: cached,
      meta: { cached: true, cachedAt: new Date().toISOString() },
    });
  }

  // Query database
  const db = drizzle(c.env.DB);
  const results = await db
    .select({
      id: assets.id,
      symbol: assets.symbol,
      name: assets.name,
      slug: assets.slug,
      category: assets.category,
      shortDescription: assets.shortDescription,
      logoUrl: assets.logoUrl,
      coingeckoId: assets.coingeckoId,
      rank: rankings.rank,
      overallScore: rankings.overallScore,
      potentialScore: rankings.potentialScore,
      utilityScore: rankings.utilityScore,
      developerScore: rankings.developerScore,
      adoptionScore: rankings.adoptionScore,
      riskLevel: rankings.riskLevel,
    })
    .from(assets)
    .innerJoin(rankings, eq(assets.id, rankings.assetId))
    .orderBy(asc(rankings.rank))
    .limit(10);

  // Cache results
  await c.env.CACHE.put(cacheKey, JSON.stringify(results), {
    expirationTtl: CACHE_TTL.TOP_10,
  });

  return c.json({ data: results, meta: { cached: false } });
});

// ============================================
// GET /api/assets/:slug
// Returns detailed asset information
// ============================================
assetsRoutes.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const db = drizzle(c.env.DB);

  const result = await db
    .select({
      id: assets.id,
      symbol: assets.symbol,
      name: assets.name,
      slug: assets.slug,
      category: assets.category,
      description: assets.description,
      shortDescription: assets.shortDescription,
      website: assets.website,
      whitepaper: assets.whitepaper,
      logoUrl: assets.logoUrl,
      coingeckoId: assets.coingeckoId,
      rank: rankings.rank,
      overallScore: rankings.overallScore,
      potentialScore: rankings.potentialScore,
      utilityScore: rankings.utilityScore,
      developerScore: rankings.developerScore,
      adoptionScore: rankings.adoptionScore,
      riskLevel: rankings.riskLevel,
      strengths: rankings.strengths,
      weaknesses: rankings.weaknesses,
      analysisNotes: rankings.analysisNotes,
    })
    .from(assets)
    .innerJoin(rankings, eq(assets.id, rankings.assetId))
    .where(eq(assets.slug, slug))
    .limit(1);

  if (result.length === 0) {
    return c.json({ error: "Asset not found" }, 404);
  }

  return c.json({ data: result[0] });
});

// ============================================
// GET /api/assets/symbol/:symbol
// Returns asset by symbol (e.g., BTC, ETH)
// ============================================
assetsRoutes.get("/symbol/:symbol", async (c) => {
  const symbol = c.req.param("symbol").toUpperCase();
  const db = drizzle(c.env.DB);

  const result = await db
    .select()
    .from(assets)
    .where(eq(assets.symbol, symbol))
    .limit(1);

  if (result.length === 0) {
    return c.json({ error: "Asset not found" }, 404);
  }

  return c.json({ data: result[0] });
});

// ============================================
// GET /api/assets/meta/categories
// Returns available asset categories
// ============================================
assetsRoutes.get("/meta/categories", async (c) => {
  const categories = [
    { id: "L1", name: "Layer 1", description: "Base layer blockchains" },
    { id: "L2", name: "Layer 2", description: "Scaling solutions built on L1s" },
    { id: "DeFi", name: "DeFi", description: "Decentralized finance protocols" },
    { id: "Infrastructure", name: "Infrastructure", description: "Essential blockchain infrastructure" },
  ];

  return c.json({ data: categories });
});
