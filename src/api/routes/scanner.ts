import { Hono } from "hono";
import type { Env, ChainId } from "../types";
import { CACHE_KEYS, CACHE_TTL } from "../types";
import { analyzeContract, quickCheckContract } from "../services/contractScanner";

export const scannerRoutes = new Hono<{ Bindings: Env }>();

// Validate Ethereum address
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Validate chain ID
function isValidChain(chain: string): chain is ChainId {
  return ["ethereum", "bsc", "polygon", "arbitrum", "base"].includes(chain);
}

// ============================================
// POST /api/scanner/analyze
// Full contract analysis
// ============================================
scannerRoutes.post("/analyze", async (c) => {
  try {
    const body = await c.req.json<{ address: string; chain: string }>();
    const { address, chain } = body;

    // Validate inputs
    if (!address || !isValidAddress(address)) {
      return c.json({ error: "Invalid contract address" }, 400);
    }

    if (!chain || !isValidChain(chain)) {
      return c.json({ error: "Invalid chain. Supported: ethereum, bsc, polygon, arbitrum, base" }, 400);
    }

    // Check cache first
    const cacheKey = CACHE_KEYS.CONTRACT_ANALYSIS(chain, address);
    const cached = await c.env.CACHE.get(cacheKey, "json");
    if (cached) {
      return c.json({ data: cached, cached: true });
    }

    // Perform analysis
    const result = await analyzeContract(address, chain, c.env);

    // Cache the result
    await c.env.CACHE.put(cacheKey, JSON.stringify(result), {
      expirationTtl: CACHE_TTL.CONTRACT_ANALYSIS,
    });

    return c.json({ data: result, cached: false });
  } catch (error: unknown) {
    console.error("Scanner analyze error:", error);
    return c.json(
      {
        error: "Analysis failed",
        message: c.env.ENVIRONMENT === "development" ? String(error) : undefined,
      },
      500
    );
  }
});

// ============================================
// GET /api/scanner/quick-check/:address
// Fast cached check
// ============================================
scannerRoutes.get("/quick-check/:address", async (c) => {
  try {
    const address = c.req.param("address");
    const chain = (c.req.query("chain") || "ethereum") as string;

    // Validate inputs
    if (!isValidAddress(address)) {
      return c.json({ error: "Invalid contract address" }, 400);
    }

    if (!isValidChain(chain)) {
      return c.json({ error: "Invalid chain" }, 400);
    }

    // Check cache first
    const cacheKey = CACHE_KEYS.CONTRACT_QUICK(chain, address);
    const cached = await c.env.CACHE.get(cacheKey, "json");
    if (cached) {
      return c.json({ data: cached, cached: true });
    }

    // Perform quick check
    const result = await quickCheckContract(address, chain);

    // Cache the result
    await c.env.CACHE.put(cacheKey, JSON.stringify(result), {
      expirationTtl: CACHE_TTL.CONTRACT_QUICK,
    });

    return c.json({ data: result, cached: false });
  } catch (error: unknown) {
    console.error("Scanner quick-check error:", error);
    return c.json({ error: "Quick check failed" }, 500);
  }
});

// ============================================
// GET /api/scanner/report/:address
// Get cached report or trigger analysis
// ============================================
scannerRoutes.get("/report/:address", async (c) => {
  try {
    const address = c.req.param("address");
    const chain = (c.req.query("chain") || "ethereum") as string;

    // Validate inputs
    if (!isValidAddress(address)) {
      return c.json({ error: "Invalid contract address" }, 400);
    }

    if (!isValidChain(chain)) {
      return c.json({ error: "Invalid chain" }, 400);
    }

    // Check cache
    const cacheKey = CACHE_KEYS.CONTRACT_ANALYSIS(chain, address);
    const cached = await c.env.CACHE.get(cacheKey, "json");

    if (cached) {
      return c.json({ data: cached, cached: true });
    }

    // No cached report, perform analysis
    const result = await analyzeContract(address, chain as ChainId, c.env);

    // Cache the result
    await c.env.CACHE.put(cacheKey, JSON.stringify(result), {
      expirationTtl: CACHE_TTL.CONTRACT_ANALYSIS,
    });

    return c.json({ data: result, cached: false });
  } catch (error: unknown) {
    console.error("Scanner report error:", error);
    return c.json({ error: "Report generation failed" }, 500);
  }
});

// ============================================
// GET /api/scanner/supported-chains
// List supported chains
// ============================================
scannerRoutes.get("/supported-chains", (c) => {
  return c.json({
    chains: [
      { id: "ethereum", name: "Ethereum", chainId: 1 },
      { id: "bsc", name: "BNB Smart Chain", chainId: 56 },
      { id: "polygon", name: "Polygon", chainId: 137 },
      { id: "arbitrum", name: "Arbitrum One", chainId: 42161 },
      { id: "base", name: "Base", chainId: 8453 },
    ],
  });
});

export default scannerRoutes;
