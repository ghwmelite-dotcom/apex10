import { useQuery, useMutation } from "@tanstack/react-query";

const API_BASE = "/api";

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  const json = (await response.json()) as { data: T };
  return json.data;
}

// ============================================
// RANKING METHODOLOGY
// ============================================
interface RankingCriterion {
  name: string;
  weight: number;
  description: string;
  factors: string[];
}

interface RiskLevel {
  level: string;
  description: string;
  examples: string;
}

interface RankingMethodology {
  overview: string;
  lastUpdated: string;
  criteria: RankingCriterion[];
  riskLevels: RiskLevel[];
  disclaimer: string;
}

export function useRankingMethodology() {
  return useQuery<RankingMethodology>({
    queryKey: ["rankings", "methodology"],
    queryFn: () => fetchApi<RankingMethodology>("/rankings/methodology"),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// ============================================
// RANKINGS BY CATEGORY
// ============================================
interface RankedAssetSummary {
  category: string;
  symbol: string;
  name: string;
  rank: number;
  overallScore: number;
}

export function useRankingsByCategory() {
  return useQuery<Record<string, RankedAssetSummary[]>>({
    queryKey: ["rankings", "categories"],
    queryFn: () =>
      fetchApi<Record<string, RankedAssetSummary[]>>("/rankings/categories"),
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================
// COMPARE ASSETS
// ============================================
export function useCompareAssets(asset1: string, asset2: string) {
  return useQuery({
    queryKey: ["rankings", "compare", asset1, asset2],
    queryFn: () =>
      fetchApi<{ asset1: any; asset2: any }>(
        `/rankings/compare?asset1=${asset1}&asset2=${asset2}`
      ),
    enabled: !!asset1 && !!asset2,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================
// CUSTOM RANKING
// ============================================
interface CustomWeights {
  potentialWeight: number;
  utilityWeight: number;
  developerWeight: number;
  adoptionWeight: number;
}

interface CustomRankedAsset {
  symbol: string;
  name: string;
  potentialScore: number;
  utilityScore: number;
  developerScore: number;
  adoptionScore: number;
  customScore: number;
  customRank: number;
}

export function useCustomRanking() {
  return useMutation({
    mutationFn: async (weights: CustomWeights) => {
      const response = await fetch(`${API_BASE}/rankings/custom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(weights),
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const json = (await response.json()) as { data: CustomRankedAsset[] };
      return json.data;
    },
  });
}
