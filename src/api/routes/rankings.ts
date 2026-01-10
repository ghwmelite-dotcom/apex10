import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { rankings, assets } from "../../../db/schema";
import type { Env } from "../types";
import { CACHE_KEYS, CACHE_TTL } from "../types";

export const rankingsRoutes = new Hono<{ Bindings: Env }>();

// ============================================
// GET /api/rankings/methodology
// Returns ranking methodology explanation
// ============================================
rankingsRoutes.get("/methodology", async (c) => {
  const cacheKey = CACHE_KEYS.RANKINGS_METHODOLOGY;

  const cached = await c.env.CACHE.get(cacheKey, "json");
  if (cached) {
    return c.json({ data: cached, meta: { cached: true } });
  }

  const methodology = {
    overview:
      "Our ranking system evaluates crypto assets across four key dimensions, each weighted to reflect its importance in determining long-term potential.",
    lastUpdated: "2024-01-15",
    criteria: [
      {
        name: "Potential Score",
        weight: 30,
        description:
          "Evaluates growth potential based on market position, technology innovation, and addressable market size.",
        factors: [
          "Market cap relative to potential",
          "Technology differentiation",
          "Competitive positioning",
          "Growth trajectory",
        ],
      },
      {
        name: "Utility Score",
        weight: 25,
        description:
          "Measures real-world usage and practical applications of the asset and its ecosystem.",
        factors: [
          "Transaction volume",
          "Active applications",
          "User engagement",
          "Revenue generation",
        ],
      },
      {
        name: "Developer Score",
        weight: 25,
        description:
          "Assesses the health and activity of the developer ecosystem building on the platform.",
        factors: [
          "GitHub activity",
          "Developer count",
          "Documentation quality",
          "Developer tools",
        ],
      },
      {
        name: "Adoption Score",
        weight: 20,
        description:
          "Tracks user adoption, institutional interest, and mainstream awareness.",
        factors: [
          "Active addresses",
          "Institutional holdings",
          "Exchange listings",
          "Media presence",
        ],
      },
    ],
    riskLevels: [
      {
        level: "low",
        description: "Established assets with proven track records and high liquidity.",
        examples: "Bitcoin, Ethereum",
      },
      {
        level: "medium",
        description: "Growing assets with solid fundamentals but higher volatility.",
        examples: "Most altcoins in our Top 10",
      },
      {
        level: "high",
        description: "Newer or more speculative assets with significant upside and downside potential.",
        examples: "Emerging protocols, new tokens",
      },
    ],
    disclaimer:
      "Rankings are for educational purposes only and should not be considered financial advice. Always conduct your own research before making investment decisions.",
  };

  await c.env.CACHE.put(cacheKey, JSON.stringify(methodology), {
    expirationTtl: CACHE_TTL.RANKINGS,
  });

  return c.json({ data: methodology, meta: { cached: false } });
});

// ============================================
// GET /api/rankings/categories
// Returns ranking breakdown by category
// ============================================
rankingsRoutes.get("/categories", async (c) => {
  const db = drizzle(c.env.DB);

  const results = await db
    .select({
      category: assets.category,
      symbol: assets.symbol,
      name: assets.name,
      rank: rankings.rank,
      overallScore: rankings.overallScore,
    })
    .from(assets)
    .innerJoin(rankings, eq(assets.id, rankings.assetId))
    .orderBy(rankings.rank);

  // Group by category
  const grouped = results.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof results>
  );

  return c.json({ data: grouped });
});

// ============================================
// GET /api/rankings/compare
// Compare two assets side by side
// ============================================
rankingsRoutes.get("/compare", async (c) => {
  const asset1 = c.req.query("asset1");
  const asset2 = c.req.query("asset2");

  if (!asset1 || !asset2) {
    return c.json({ error: "Both asset1 and asset2 query params required" }, 400);
  }

  const db = drizzle(c.env.DB);

  const results = await db
    .select({
      symbol: assets.symbol,
      name: assets.name,
      category: assets.category,
      rank: rankings.rank,
      overallScore: rankings.overallScore,
      potentialScore: rankings.potentialScore,
      utilityScore: rankings.utilityScore,
      developerScore: rankings.developerScore,
      adoptionScore: rankings.adoptionScore,
      riskLevel: rankings.riskLevel,
      strengths: rankings.strengths,
      weaknesses: rankings.weaknesses,
    })
    .from(assets)
    .innerJoin(rankings, eq(assets.id, rankings.assetId))
    .where(eq(assets.slug, asset1));

  const results2 = await db
    .select({
      symbol: assets.symbol,
      name: assets.name,
      category: assets.category,
      rank: rankings.rank,
      overallScore: rankings.overallScore,
      potentialScore: rankings.potentialScore,
      utilityScore: rankings.utilityScore,
      developerScore: rankings.developerScore,
      adoptionScore: rankings.adoptionScore,
      riskLevel: rankings.riskLevel,
      strengths: rankings.strengths,
      weaknesses: rankings.weaknesses,
    })
    .from(assets)
    .innerJoin(rankings, eq(assets.id, rankings.assetId))
    .where(eq(assets.slug, asset2));

  if (results.length === 0 || results2.length === 0) {
    return c.json({ error: "One or both assets not found" }, 404);
  }

  return c.json({
    data: {
      asset1: results[0],
      asset2: results2[0],
    },
  });
});

// ============================================
// POST /api/rankings/custom
// Calculate custom weighted ranking
// ============================================
rankingsRoutes.post("/custom", async (c) => {
  const body = await c.req.json<{
    potentialWeight: number;
    utilityWeight: number;
    developerWeight: number;
    adoptionWeight: number;
  }>();

  const { potentialWeight, utilityWeight, developerWeight, adoptionWeight } = body;

  // Validate weights sum to 100
  const totalWeight = potentialWeight + utilityWeight + developerWeight + adoptionWeight;
  if (Math.abs(totalWeight - 100) > 0.01) {
    return c.json({ error: "Weights must sum to 100" }, 400);
  }

  const db = drizzle(c.env.DB);

  const results = await db
    .select({
      symbol: assets.symbol,
      name: assets.name,
      potentialScore: rankings.potentialScore,
      utilityScore: rankings.utilityScore,
      developerScore: rankings.developerScore,
      adoptionScore: rankings.adoptionScore,
    })
    .from(assets)
    .innerJoin(rankings, eq(assets.id, rankings.assetId));

  // Calculate custom scores
  const customRanked = results
    .map((asset) => ({
      ...asset,
      customScore:
        (asset.potentialScore * potentialWeight +
          asset.utilityScore * utilityWeight +
          asset.developerScore * developerWeight +
          asset.adoptionScore * adoptionWeight) /
        100,
    }))
    .sort((a, b) => b.customScore - a.customScore)
    .map((asset, index) => ({
      ...asset,
      customRank: index + 1,
    }));

  return c.json({
    data: customRanked,
    meta: {
      weights: { potentialWeight, utilityWeight, developerWeight, adoptionWeight },
    },
  });
});
