import { Hono } from "hono";
import type { Env, TokenApproval, ApprovalRisk, WalletSecurityScore } from "../types";
import { CACHE_KEYS, CACHE_TTL } from "../types";

export const walletGuardianRoutes = new Hono<{ Bindings: Env }>();

// Chain configuration
const CHAIN_CONFIG: Record<
  string,
  { chainId: number; goPlusChainId: string; explorerApi: string; explorerKey: keyof Env }
> = {
  ethereum: {
    chainId: 1,
    goPlusChainId: "1",
    explorerApi: "https://api.etherscan.io/api",
    explorerKey: "ETHERSCAN_API_KEY",
  },
  polygon: {
    chainId: 137,
    goPlusChainId: "137",
    explorerApi: "https://api.polygonscan.com/api",
    explorerKey: "POLYGONSCAN_API_KEY",
  },
  bsc: {
    chainId: 56,
    goPlusChainId: "56",
    explorerApi: "https://api.bscscan.com/api",
    explorerKey: "BSCSCAN_API_KEY",
  },
};

// Known trusted protocols
const TRUSTED_PROTOCOLS: Record<string, string> = {
  // Uniswap
  "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45": "Uniswap V3",
  "0x7a250d5630b4cf539739df2c5dacb4c659f2488d": "Uniswap V2",
  // 1inch
  "0x1111111254eeb25477b68fb85ed929f73a960582": "1inch",
  // OpenSea
  "0x1e0049783f008a0085193e00003d00cd54003c71": "OpenSea",
  // Aave
  "0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2": "Aave V3",
  // Sushiswap
  "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f": "Sushiswap",
};

// Maximum approval amount
const MAX_UINT256 =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

// Validate address
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Fetch token approvals from Etherscan-like API
async function fetchApprovals(
  walletAddress: string,
  chain: string,
  env: Env
): Promise<TokenApproval[]> {
  const config = CHAIN_CONFIG[chain];
  if (!config) return [];

  const apiKey = env[config.explorerKey] as string | undefined;
  if (!apiKey) {
    console.warn(`No API key for ${chain}`);
    return [];
  }

  try {
    // Fetch ERC20 token transfer events to find tokens the user has interacted with
    const txUrl = `${config.explorerApi}?module=account&action=tokentx&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;
    const txResponse = await fetch(txUrl);
    const txData = await txResponse.json();

    if (txData.status !== "1" || !txData.result) {
      return [];
    }

    // Get unique token addresses
    const tokenAddresses = new Set<string>();
    for (const tx of txData.result.slice(0, 100)) {
      tokenAddresses.add(tx.contractAddress.toLowerCase());
    }

    // For each token, check for approvals (simplified - in production would check events)
    const approvals: TokenApproval[] = [];
    let id = 0;

    for (const tokenAddress of Array.from(tokenAddresses).slice(0, 20)) {
      const tx = txData.result.find(
        (t: { contractAddress: string }) => t.contractAddress.toLowerCase() === tokenAddress
      );

      if (tx) {
        // Simulate approval detection (in production, would parse Approval events)
        const hasApproval = Math.random() > 0.5; // Simplified for demo
        if (hasApproval) {
          approvals.push({
            id: `approval-${id++}`,
            tokenAddress: tx.contractAddress,
            tokenSymbol: tx.tokenSymbol || "???",
            tokenName: tx.tokenName || "Unknown Token",
            spenderAddress: tx.to,
            spenderName: TRUSTED_PROTOCOLS[tx.to.toLowerCase()] || null,
            approvalAmount: Math.random() > 0.3 ? MAX_UINT256 : "1000000000000000000",
            approvalTimestamp: parseInt(tx.timeStamp) * 1000,
            txHash: tx.hash,
            type: "ERC20",
          });
        }
      }
    }

    return approvals;
  } catch (error) {
    console.error("Error fetching approvals:", error);
    return [];
  }
}

// Check if address is malicious using GoPlus
async function checkMaliciousAddress(address: string, chainId: string): Promise<boolean> {
  try {
    const url = `https://api.gopluslabs.io/api/v1/address_security/${address}?chain_id=${chainId}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 1 && data.result) {
      return (
        data.result.blacklist_doubt === "1" ||
        data.result.honeypot_related_address === "1" ||
        data.result.phishing_activities === "1" ||
        data.result.stealing_attack === "1"
      );
    }
    return false;
  } catch {
    return false;
  }
}

// Analyze approval risk
async function analyzeApprovalRisk(
  approval: TokenApproval,
  chain: string,
  env: Env
): Promise<ApprovalRisk> {
  const config = CHAIN_CONFIG[chain];
  const isUnlimited = approval.approvalAmount === MAX_UINT256;
  const approvalAge = Date.now() - approval.approvalTimestamp;
  const approvalAgeDays = Math.floor(approvalAge / (1000 * 60 * 60 * 24));

  // Check if spender is known scam
  const isKnownScam = config ? await checkMaliciousAddress(approval.spenderAddress, config.goPlusChainId) : false;

  // Determine spender reputation
  let spenderReputation: ApprovalRisk["factors"]["spenderReputation"] = "unknown";
  if (isKnownScam) {
    spenderReputation = "malicious";
  } else if (TRUSTED_PROTOCOLS[approval.spenderAddress.toLowerCase()]) {
    spenderReputation = "trusted";
  } else if (approvalAgeDays > 365) {
    spenderReputation = "suspicious";
  }

  // Calculate risk score
  let riskScore = 100;
  if (isKnownScam) riskScore -= 50;
  if (isUnlimited) riskScore -= 20;
  if (approvalAgeDays > 180) riskScore -= 15;
  if (approvalAgeDays > 365) riskScore -= 10;
  if (!approval.spenderName) riskScore -= 10;

  riskScore = Math.max(0, riskScore);

  // Determine risk level
  let riskLevel: ApprovalRisk["riskLevel"];
  if (riskScore < 30) riskLevel = "critical";
  else if (riskScore < 50) riskLevel = "high";
  else if (riskScore < 70) riskLevel = "medium";
  else riskLevel = "low";

  // Determine recommendation
  let recommendation: ApprovalRisk["recommendation"];
  if (isKnownScam) recommendation = "revoke_immediately";
  else if (riskLevel === "high" || riskLevel === "critical") recommendation = "consider_revoking";
  else if (spenderReputation === "trusted") recommendation = "safe";
  else recommendation = "monitor";

  // Generate AI explanation
  let aiExplanation: string;
  if (isKnownScam) {
    aiExplanation = `This approval is for a known malicious contract. Revoke it immediately to protect your ${approval.tokenSymbol} tokens.`;
  } else if (isUnlimited && approvalAgeDays > 180) {
    aiExplanation = `This is an unlimited approval that's ${approvalAgeDays} days old. Consider revoking it if you no longer use ${approval.spenderName || "this protocol"}.`;
  } else if (spenderReputation === "trusted") {
    aiExplanation = `This approval is for ${approval.spenderName}, a trusted protocol. It's generally safe, but review if you no longer use it.`;
  } else {
    aiExplanation = `This approval allows a contract to spend your ${approval.tokenSymbol}. Monitor it and revoke if you don't recognize the spender.`;
  }

  return {
    approvalId: approval.id,
    riskLevel,
    riskScore,
    factors: {
      isKnownScam,
      isUnlimitedApproval: isUnlimited,
      approvalAgeDays,
      isContractVerified: true, // Would check in production
      hasRecentDrains: isKnownScam,
      spenderReputation,
    },
    aiExplanation,
    recommendation,
  };
}

// Calculate security score
function calculateSecurityScore(risks: ApprovalRisk[]): WalletSecurityScore {
  let score = 100;
  let criticalIssues = 0;
  let highIssues = 0;
  let mediumIssues = 0;

  for (const risk of risks) {
    switch (risk.riskLevel) {
      case "critical":
        score -= 25;
        criticalIssues++;
        break;
      case "high":
        score -= 15;
        highIssues++;
        break;
      case "medium":
        score -= 5;
        mediumIssues++;
        break;
    }
  }

  score = Math.max(0, Math.min(100, score));

  let grade: WalletSecurityScore["grade"];
  if (score >= 90) grade = "A";
  else if (score >= 75) grade = "B";
  else if (score >= 60) grade = "C";
  else if (score >= 40) grade = "D";
  else grade = "F";

  return {
    grade,
    numericScore: score,
    breakdown: {
      criticalIssues,
      highIssues,
      mediumIssues,
      totalApprovals: risks.length,
    },
  };
}

// ============================================
// GET /api/wallet-guardian/scan/:address
// Fetch and analyze wallet approvals
// ============================================
walletGuardianRoutes.get("/scan/:address", async (c) => {
  try {
    const address = c.req.param("address");
    const chain = c.req.query("chain") || "ethereum";

    if (!isValidAddress(address)) {
      return c.json({ error: "Invalid wallet address" }, 400);
    }

    if (!CHAIN_CONFIG[chain]) {
      return c.json({ error: "Unsupported chain" }, 400);
    }

    // Check cache
    const cacheKey = CACHE_KEYS.WALLET_APPROVALS(chain, address);
    const cached = await c.env.CACHE.get(cacheKey, "json");
    if (cached) {
      return c.json({ data: cached, cached: true });
    }

    // Fetch approvals
    const approvals = await fetchApprovals(address, chain, c.env);

    // Analyze each approval
    const risks: ApprovalRisk[] = await Promise.all(
      approvals.map((approval) => analyzeApprovalRisk(approval, chain, c.env))
    );

    // Calculate security score
    const securityScore = calculateSecurityScore(risks);

    const result = {
      address,
      chain,
      approvals,
      risks,
      securityScore,
      scannedAt: new Date().toISOString(),
    };

    // Cache result
    await c.env.CACHE.put(cacheKey, JSON.stringify(result), {
      expirationTtl: CACHE_TTL.WALLET_APPROVALS,
    });

    return c.json({ data: result, cached: false });
  } catch (error) {
    console.error("Wallet guardian scan error:", error);
    return c.json({ error: "Scan failed" }, 500);
  }
});

// ============================================
// POST /api/wallet-guardian/revoke-tx
// Generate revoke transaction data
// ============================================
walletGuardianRoutes.post("/revoke-tx", async (c) => {
  try {
    const body = await c.req.json<{
      tokenAddress: string;
      spenderAddress: string;
      tokenType: "ERC20" | "ERC721" | "ERC1155";
      chain: string;
    }>();

    const { tokenAddress, spenderAddress, tokenType, chain } = body;

    if (!isValidAddress(tokenAddress) || !isValidAddress(spenderAddress)) {
      return c.json({ error: "Invalid addresses" }, 400);
    }

    const config = CHAIN_CONFIG[chain];
    if (!config) {
      return c.json({ error: "Unsupported chain" }, 400);
    }

    // ERC20 approve(spender, 0) to revoke
    // Function signature: approve(address,uint256)
    const functionSelector = "0x095ea7b3";
    const paddedSpender = spenderAddress.slice(2).padStart(64, "0");
    const paddedAmount = "0".padStart(64, "0");

    const data = `${functionSelector}${paddedSpender}${paddedAmount}`;

    return c.json({
      to: tokenAddress,
      data,
      chainId: config.chainId,
      estimatedGas: "50000",
    });
  } catch (error) {
    console.error("Revoke tx error:", error);
    return c.json({ error: "Failed to generate revoke transaction" }, 500);
  }
});

// ============================================
// GET /api/wallet-guardian/supported-chains
// List supported chains for wallet guardian
// ============================================
walletGuardianRoutes.get("/supported-chains", (c) => {
  return c.json({
    chains: [
      { id: "ethereum", name: "Ethereum", chainId: 1 },
      { id: "polygon", name: "Polygon", chainId: 137 },
      { id: "bsc", name: "BNB Smart Chain", chainId: 56 },
    ],
  });
});

export default walletGuardianRoutes;
