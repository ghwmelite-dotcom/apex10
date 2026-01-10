import type { Env, ContractAnalysisResult, RiskFactor, ChainId } from "../types";

// Chain configuration
const CHAIN_CONFIG: Record<
  ChainId,
  { goPlusChainId: string; explorerApi: string; explorerKey: keyof Env }
> = {
  ethereum: {
    goPlusChainId: "1",
    explorerApi: "https://api.etherscan.io/api",
    explorerKey: "ETHERSCAN_API_KEY",
  },
  bsc: {
    goPlusChainId: "56",
    explorerApi: "https://api.bscscan.com/api",
    explorerKey: "BSCSCAN_API_KEY",
  },
  polygon: {
    goPlusChainId: "137",
    explorerApi: "https://api.polygonscan.com/api",
    explorerKey: "POLYGONSCAN_API_KEY",
  },
  arbitrum: {
    goPlusChainId: "42161",
    explorerApi: "https://api.arbiscan.io/api",
    explorerKey: "ARBISCAN_API_KEY",
  },
  base: {
    goPlusChainId: "8453",
    explorerApi: "https://api.basescan.org/api",
    explorerKey: "BASESCAN_API_KEY",
  },
};

// GoPlus API response types
interface GoPlusTokenSecurity {
  is_honeypot?: string;
  honeypot_with_same_creator?: string;
  is_open_source?: string;
  is_proxy?: string;
  is_mintable?: string;
  can_take_back_ownership?: string;
  owner_change_balance?: string;
  hidden_owner?: string;
  selfdestruct?: string;
  external_call?: string;
  buy_tax?: string;
  sell_tax?: string;
  cannot_buy?: string;
  cannot_sell_all?: string;
  slippage_modifiable?: string;
  is_blacklisted?: string;
  is_whitelisted?: string;
  is_anti_whale?: string;
  trading_cooldown?: string;
  transfer_pausable?: string;
  owner_address?: string;
  creator_address?: string;
  token_name?: string;
  token_symbol?: string;
  total_supply?: string;
  holder_count?: string;
  lp_holder_count?: string;
  lp_total_supply?: string;
  is_true_token?: string;
  is_airdrop_scam?: string;
  trust_list?: string;
  other_potential_risks?: string;
  note?: string;
  holders?: Array<{
    address: string;
    balance: string;
    percent: string;
    is_locked: number;
    is_contract: number;
  }>;
  lp_holders?: Array<{
    address: string;
    balance: string;
    percent: string;
    is_locked: number;
    is_contract: number;
  }>;
  dex?: Array<{
    name: string;
    liquidity: string;
    pair: string;
  }>;
}

// DEXScreener API response types
interface DEXScreenerPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  liquidity?: {
    usd: number;
  };
  fdv?: number;
  pairCreatedAt?: number;
}

interface DEXScreenerResponse {
  pairs: DEXScreenerPair[] | null;
}

// Create a risk factor
function createRiskFactor(
  id: string,
  name: string,
  detected: boolean,
  severity: RiskFactor["severity"],
  description: string,
  educationalTip: string
): RiskFactor {
  return { id, name, detected, severity, description, educationalTip };
}

// Fetch GoPlus security data
async function fetchGoPlusData(
  address: string,
  chainId: string
): Promise<GoPlusTokenSecurity | null> {
  try {
    const url = `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${address}`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.code !== 1 || !data.result) return null;

    const tokenData = data.result[address.toLowerCase()];
    return tokenData || null;
  } catch (error) {
    console.error("GoPlus API error:", error);
    return null;
  }
}

// Fetch DEXScreener liquidity data
async function fetchDEXScreenerData(address: string): Promise<DEXScreenerResponse | null> {
  try {
    const url = `https://api.dexscreener.com/latest/dex/tokens/${address}`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error("DEXScreener API error:", error);
    return null;
  }
}

// Check if contract is verified on explorer
async function checkContractVerification(
  address: string,
  chain: ChainId,
  env: Env
): Promise<boolean> {
  try {
    const config = CHAIN_CONFIG[chain];
    const apiKey = env[config.explorerKey] as string | undefined;

    if (!apiKey) return false;

    const url = `${config.explorerApi}?module=contract&action=getabi&address=${address}&apikey=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) return false;

    const data = await response.json();
    return data.status === "1" && data.message === "OK";
  } catch (error) {
    console.error("Explorer API error:", error);
    return false;
  }
}

// Calculate risk score based on all factors
function calculateRiskScore(
  goplus: GoPlusTokenSecurity | null,
  dexScreener: DEXScreenerResponse | null,
  isVerified: boolean
): { score: number; level: ContractAnalysisResult["riskLevel"] } {
  let score = 100;

  if (goplus) {
    // Critical risks (deduct heavily)
    if (goplus.is_honeypot === "1") score -= 40;
    if (goplus.cannot_sell_all === "1") score -= 35;
    if (goplus.hidden_owner === "1") score -= 25;
    if (goplus.owner_change_balance === "1") score -= 30;
    if (goplus.is_airdrop_scam === "1") score -= 40;

    // High risks
    if (goplus.is_mintable === "1") score -= 15;
    if (goplus.selfdestruct === "1") score -= 20;
    if (goplus.external_call === "1") score -= 10;
    if (goplus.transfer_pausable === "1") score -= 10;
    if (goplus.can_take_back_ownership === "1") score -= 15;

    // Tax risks
    const buyTax = parseFloat(goplus.buy_tax || "0") * 100;
    const sellTax = parseFloat(goplus.sell_tax || "0") * 100;
    if (buyTax > 10 || sellTax > 10) score -= 15;
    if (buyTax > 20 || sellTax > 20) score -= 15;

    // Positive factors
    if (goplus.is_open_source === "1") score += 5;
    if (goplus.trust_list === "1") score += 10;

    // Proxy contract
    if (goplus.is_proxy === "1") score -= 10;
  }

  // Verification bonus
  if (!isVerified) score -= 15;
  if (isVerified) score += 5;

  // Liquidity analysis
  if (dexScreener?.pairs && dexScreener.pairs.length > 0) {
    const totalLiquidity = dexScreener.pairs.reduce(
      (sum, pair) => sum + (pair.liquidity?.usd || 0),
      0
    );
    if (totalLiquidity < 1000) score -= 20;
    else if (totalLiquidity < 10000) score -= 10;
    else if (totalLiquidity > 100000) score += 5;
  } else {
    score -= 15; // No liquidity found
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determine risk level
  let level: ContractAnalysisResult["riskLevel"];
  if (score >= 80) level = "safe";
  else if (score >= 60) level = "low";
  else if (score >= 40) level = "medium";
  else if (score >= 20) level = "high";
  else level = "critical";

  return { score, level };
}

// Build risk factors from analysis data
function buildRiskFactors(
  goplus: GoPlusTokenSecurity | null,
  dexScreener: DEXScreenerResponse | null,
  isVerified: boolean
): ContractAnalysisResult["riskFactors"] {
  const isHoneypot = goplus?.is_honeypot === "1" || goplus?.cannot_sell_all === "1";
  const hasRugPullRisks =
    goplus?.hidden_owner === "1" ||
    goplus?.owner_change_balance === "1" ||
    goplus?.can_take_back_ownership === "1";
  const buyTax = parseFloat(goplus?.buy_tax || "0") * 100;
  const sellTax = parseFloat(goplus?.sell_tax || "0") * 100;
  const isHighTax = buyTax > 10 || sellTax > 10;
  const totalLiquidity =
    dexScreener?.pairs?.reduce((sum, pair) => sum + (pair.liquidity?.usd || 0), 0) || 0;
  const hasLiquidityLocked =
    goplus?.lp_holders?.some((h) => h.is_locked === 1 && parseFloat(h.percent) > 50) || false;

  return {
    honeypot: createRiskFactor(
      "honeypot",
      "Honeypot Detection",
      isHoneypot,
      isHoneypot ? "critical" : "safe",
      isHoneypot
        ? "This token shows honeypot characteristics - you may not be able to sell after buying."
        : "No honeypot indicators detected. Token appears tradeable.",
      "A honeypot is a scam where you can buy but cannot sell. The contract traps your funds permanently."
    ),
    rugPull: createRiskFactor(
      "rugPull",
      "Rug Pull Indicators",
      hasRugPullRisks,
      hasRugPullRisks ? "high" : "safe",
      hasRugPullRisks
        ? "Contract owner has elevated privileges that could be used to manipulate the token."
        : "No dangerous owner privileges detected.",
      "Rug pull indicators show if the owner can drain liquidity, change balances, or take back ownership."
    ),
    taxes: createRiskFactor(
      "taxes",
      "Buy/Sell Tax Analysis",
      isHighTax,
      isHighTax ? (buyTax > 20 || sellTax > 20 ? "high" : "medium") : "safe",
      isHighTax
        ? `High taxes detected: ${buyTax.toFixed(1)}% buy / ${sellTax.toFixed(1)}% sell`
        : `Normal taxes: ${buyTax.toFixed(1)}% buy / ${sellTax.toFixed(1)}% sell`,
      "Some tokens have built-in taxes on trades. High taxes (>10%) significantly reduce profits."
    ),
    liquidity: createRiskFactor(
      "liquidity",
      "Liquidity Analysis",
      totalLiquidity < 10000,
      totalLiquidity < 1000 ? "high" : totalLiquidity < 10000 ? "medium" : "safe",
      totalLiquidity > 0
        ? `$${totalLiquidity.toLocaleString()} total liquidity${hasLiquidityLocked ? " (partially locked)" : ""}`
        : "No liquidity found on major DEXes",
      "Liquidity is the amount of funds available for trading. Low liquidity means high slippage and potential inability to sell."
    ),
    ownership: createRiskFactor(
      "ownership",
      "Ownership Privileges",
      goplus?.hidden_owner === "1" || goplus?.can_take_back_ownership === "1",
      goplus?.hidden_owner === "1" ? "high" : "safe",
      goplus?.hidden_owner === "1"
        ? "Hidden owner detected - true owner is concealed"
        : goplus?.owner_address
          ? `Owner: ${goplus.owner_address.slice(0, 6)}...${goplus.owner_address.slice(-4)}`
          : "Ownership renounced or not applicable",
      "Contract owners may have special privileges like minting, pausing, or changing tax rates."
    ),
    mintable: createRiskFactor(
      "mintable",
      "Minting Capability",
      goplus?.is_mintable === "1",
      goplus?.is_mintable === "1" ? "medium" : "safe",
      goplus?.is_mintable === "1"
        ? "Contract can mint new tokens, potentially diluting your holdings."
        : "No minting capability detected.",
      "If a contract can mint new tokens, supply can increase at any time, diluting existing holders."
    ),
    proxy: createRiskFactor(
      "proxy",
      "Proxy Contract",
      goplus?.is_proxy === "1",
      goplus?.is_proxy === "1" ? "medium" : "safe",
      goplus?.is_proxy === "1"
        ? "This is a proxy contract - logic can be upgraded."
        : "Not a proxy contract.",
      "Proxy contracts can be upgraded, meaning behavior can change after deployment. This adds risk."
    ),
  };
}

// Generate AI explanation for the analysis
async function generateAIExplanation(
  riskFactors: ContractAnalysisResult["riskFactors"],
  riskScore: number,
  riskLevel: string,
  env: Env
): Promise<string> {
  try {
    const riskSummary = Object.values(riskFactors)
      .filter((f) => f.detected)
      .map((f) => `- ${f.name}: ${f.description}`)
      .join("\n");

    const prompt = `You are a crypto security expert explaining contract analysis results to newcomers.

Risk Score: ${riskScore}/100 (${riskLevel})
${riskSummary ? `\nDetected Issues:\n${riskSummary}` : "\nNo major issues detected."}

Provide a clear, friendly 2-3 sentence explanation that:
1. Summarizes the main risks (or confirms safety) in simple terms
2. Gives a clear recommendation (avoid, proceed with caution, or safe to explore)

Be honest but not alarmist. This is educational, not financial advice.`;

    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content:
            "You are a helpful crypto security assistant. Keep responses under 100 words, friendly and educational.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
    });

    return (response as { response?: string }).response || getFallbackExplanation(riskLevel);
  } catch (error) {
    console.error("AI explanation error:", error);
    return getFallbackExplanation(riskLevel);
  }
}

function getFallbackExplanation(riskLevel: string): string {
  switch (riskLevel) {
    case "critical":
      return "This contract shows critical red flags including potential honeypot characteristics. We strongly recommend avoiding this token entirely.";
    case "high":
      return "This contract has significant risk factors that warrant extreme caution. Consider the risks carefully before any interaction.";
    case "medium":
      return "This contract has some concerning factors. Proceed with caution and only invest what you can afford to lose.";
    case "low":
      return "This contract appears relatively safe with minor concerns. Standard crypto investment caution still applies.";
    default:
      return "This contract shows good security characteristics. As always, do your own research and invest responsibly.";
  }
}

// Main analysis function
export async function analyzeContract(
  address: string,
  chain: ChainId,
  env: Env
): Promise<ContractAnalysisResult> {
  const chainConfig = CHAIN_CONFIG[chain];

  // Fetch data from multiple sources in parallel
  const [goplus, dexScreener, isVerified] = await Promise.all([
    fetchGoPlusData(address, chainConfig.goPlusChainId),
    fetchDEXScreenerData(address),
    checkContractVerification(address, chain, env),
  ]);

  // Calculate risk score
  const { score, level } = calculateRiskScore(goplus, dexScreener, isVerified);

  // Build risk factors
  const riskFactors = buildRiskFactors(goplus, dexScreener, isVerified);

  // Get liquidity analysis
  const lpPairs =
    dexScreener?.pairs?.map((pair) => ({
      pair: `${pair.baseToken.symbol}/${pair.quoteToken.symbol}`,
      liquidityUsd: pair.liquidity?.usd || 0,
      dex: pair.dexId,
    })) || [];

  const totalLiquidityUsd = lpPairs.reduce((sum, p) => sum + p.liquidityUsd, 0);
  const hasLiquidityLocked =
    goplus?.lp_holders?.some((h) => h.is_locked === 1 && parseFloat(h.percent) > 50) || false;

  // Tax analysis
  const buyTax = parseFloat(goplus?.buy_tax || "0") * 100;
  const sellTax = parseFloat(goplus?.sell_tax || "0") * 100;

  // Generate AI explanation
  const aiExplanation = await generateAIExplanation(riskFactors, score, level, env);

  // Token info
  const tokenInfo = goplus
    ? {
        name: goplus.token_name || "Unknown",
        symbol: goplus.token_symbol || "???",
        decimals: 18, // Default, could fetch from contract
        totalSupply: goplus.total_supply || "0",
      }
    : null;

  return {
    address,
    chain,
    riskScore: score,
    riskLevel: level,
    isVerified,
    tokenInfo,
    riskFactors,
    liquidityAnalysis: {
      totalLiquidityUsd,
      isLocked: hasLiquidityLocked,
      lockDuration: null,
      lpPairs,
    },
    taxAnalysis: {
      buyTax,
      sellTax,
      isHighTax: buyTax > 10 || sellTax > 10,
    },
    aiExplanation,
    analyzedAt: new Date().toISOString(),
  };
}

// Quick check function (lighter, cached more aggressively)
export async function quickCheckContract(
  address: string,
  chain: ChainId
): Promise<{ riskScore: number; riskLevel: string; isHoneypot: boolean }> {
  const chainConfig = CHAIN_CONFIG[chain];
  const goplus = await fetchGoPlusData(address, chainConfig.goPlusChainId);

  if (!goplus) {
    return { riskScore: 50, riskLevel: "medium", isHoneypot: false };
  }

  const isHoneypot = goplus.is_honeypot === "1" || goplus.cannot_sell_all === "1";
  let score = 100;

  if (isHoneypot) score -= 50;
  if (goplus.hidden_owner === "1") score -= 20;
  if (goplus.is_mintable === "1") score -= 10;

  const buyTax = parseFloat(goplus.buy_tax || "0") * 100;
  const sellTax = parseFloat(goplus.sell_tax || "0") * 100;
  if (buyTax > 10 || sellTax > 10) score -= 15;

  score = Math.max(0, Math.min(100, score));

  let riskLevel: string;
  if (score >= 80) riskLevel = "safe";
  else if (score >= 60) riskLevel = "low";
  else if (score >= 40) riskLevel = "medium";
  else if (score >= 20) riskLevel = "high";
  else riskLevel = "critical";

  return { riskScore: score, riskLevel, isHoneypot };
}
