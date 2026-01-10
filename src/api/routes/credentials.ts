import { Hono } from "hono";
import type { Env } from "../types";

export const credentialsRoutes = new Hono<{ Bindings: Env }>();

// Tier mapping
const TIER_MAP = { bronze: 0, silver: 1, gold: 2 } as const;
const TIER_NAMES = ["Bronze", "Silver", "Gold"];

// Validate address
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// ============================================
// POST /api/credentials/mint
// Mint a new SBT credential (via relayer)
// ============================================
credentialsRoutes.post("/mint", async (c) => {
  try {
    const body = await c.req.json<{
      walletAddress: string;
      certificateId: string;
      tier: "bronze" | "silver" | "gold";
      accuracy: number;
      email: string;
      signature: string;
      message: string;
    }>();

    const { walletAddress, certificateId, tier, accuracy, email, signature, message } = body;

    // Validate inputs
    if (!walletAddress || !isValidAddress(walletAddress)) {
      return c.json({ error: "Invalid wallet address" }, 400);
    }

    if (!certificateId || !tier || typeof accuracy !== "number") {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Validate tier requirements
    const tierMinAccuracy = { bronze: 70, silver: 85, gold: 95 };
    if (accuracy < tierMinAccuracy[tier]) {
      return c.json({ error: `Accuracy ${accuracy}% does not meet ${tier} tier requirement` }, 400);
    }

    // Check if relayer is configured
    if (!c.env.RELAYER_PRIVATE_KEY || !c.env.CREDENTIAL_CONTRACT_ADDRESS) {
      // Mock response for development/demo
      const mockTokenId = Math.floor(Math.random() * 10000);
      const mockTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

      // Store credential data
      await c.env.CACHE.put(
        `credential:${certificateId}`,
        JSON.stringify({
          tokenId: mockTokenId,
          transactionHash: mockTxHash,
          walletAddress,
          tier,
          accuracy,
          email,
          mintedAt: new Date().toISOString(),
          demo: true,
        }),
        { expirationTtl: 60 * 60 * 24 * 365 }
      );

      return c.json({
        success: true,
        tokenId: mockTokenId.toString(),
        transactionHash: mockTxHash,
        polygonscanUrl: `https://polygonscan.com/tx/${mockTxHash}`,
        demo: true,
        message: "Demo mode - actual minting requires contract deployment",
      });
    }

    // In production, this would:
    // 1. Verify the signature matches the wallet
    // 2. Create the relayer wallet client
    // 3. Call the smart contract's mintCredential function
    // 4. Wait for transaction receipt
    // 5. Return the token ID and transaction hash

    // For now, return demo response
    return c.json({
      success: false,
      error: "Contract not yet deployed - coming soon!",
      message: "SBT minting will be available once the contract is deployed to Polygon",
    });
  } catch (error) {
    console.error("Credential minting error:", error);
    return c.json({ error: "Failed to mint credential" }, 500);
  }
});

// ============================================
// GET /api/credentials/verify/:tokenId
// Verify a credential on-chain
// ============================================
credentialsRoutes.get("/verify/:tokenId", async (c) => {
  try {
    const tokenId = c.req.param("tokenId");

    // Check cache for credential data
    const allKeys = await c.env.CACHE.list({ prefix: "credential:" });

    for (const key of allKeys.keys) {
      const data = await c.env.CACHE.get(key.name, "json") as {
        tokenId: number;
        walletAddress: string;
        tier: string;
        accuracy: number;
        mintedAt: string;
      } | null;

      if (data && data.tokenId.toString() === tokenId) {
        return c.json({
          valid: true,
          tokenId,
          owner: data.walletAddress,
          tier: TIER_NAMES[TIER_MAP[data.tier as keyof typeof TIER_MAP]] || data.tier,
          accuracy: data.accuracy,
          mintedAt: data.mintedAt,
          contractAddress: c.env.CREDENTIAL_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
          chain: "polygon",
        });
      }
    }

    // Not found in cache, would check on-chain in production
    return c.json({ valid: false, error: "Credential not found" }, 404);
  } catch (error) {
    console.error("Credential verification error:", error);
    return c.json({ valid: false, error: "Verification failed" }, 500);
  }
});

// ============================================
// GET /api/credentials/wallet/:address
// Get all credentials for a wallet
// ============================================
credentialsRoutes.get("/wallet/:address", async (c) => {
  try {
    const address = c.req.param("address");

    if (!isValidAddress(address)) {
      return c.json({ error: "Invalid wallet address" }, 400);
    }

    // Search cache for credentials belonging to this wallet
    const credentials: Array<{
      tokenId: string;
      tier: string;
      accuracy: number;
      mintedAt: string;
      certificateId: string;
    }> = [];

    const allKeys = await c.env.CACHE.list({ prefix: "credential:" });

    for (const key of allKeys.keys) {
      const data = await c.env.CACHE.get(key.name, "json") as {
        tokenId: number;
        walletAddress: string;
        tier: string;
        accuracy: number;
        mintedAt: string;
      } | null;

      if (data && data.walletAddress.toLowerCase() === address.toLowerCase()) {
        credentials.push({
          tokenId: data.tokenId.toString(),
          tier: TIER_NAMES[TIER_MAP[data.tier as keyof typeof TIER_MAP]] || data.tier,
          accuracy: data.accuracy,
          mintedAt: data.mintedAt,
          certificateId: key.name.replace("credential:", ""),
        });
      }
    }

    return c.json({
      address,
      credentials,
      hasCredentials: credentials.length > 0,
    });
  } catch (error) {
    console.error("Wallet credentials error:", error);
    return c.json({ address: c.req.param("address"), credentials: [], hasCredentials: false });
  }
});

// ============================================
// GET /api/credentials/stats
// Get credential statistics
// ============================================
credentialsRoutes.get("/stats", async (c) => {
  try {
    const allKeys = await c.env.CACHE.list({ prefix: "credential:" });

    let total = 0;
    const tierCounts = { bronze: 0, silver: 0, gold: 0 };

    for (const key of allKeys.keys) {
      const data = await c.env.CACHE.get(key.name, "json") as { tier: string } | null;
      if (data) {
        total++;
        if (data.tier in tierCounts) {
          tierCounts[data.tier as keyof typeof tierCounts]++;
        }
      }
    }

    return c.json({
      total,
      breakdown: tierCounts,
      contractDeployed: !!c.env.CREDENTIAL_CONTRACT_ADDRESS,
    });
  } catch (error) {
    return c.json({ total: 0, breakdown: { bronze: 0, silver: 0, gold: 0 }, contractDeployed: false });
  }
});

export default credentialsRoutes;
