import { useQuery } from "@tanstack/react-query";
import type { RankedAsset, AssetDetail, PriceData } from "@/types";

const API_BASE = "/api";

// ============================================
// FETCH HELPERS
// ============================================
async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  const json = (await response.json()) as { data: T };
  return json.data;
}

// ============================================
// TOP 10 ASSETS
// ============================================
export function useTop10Assets() {
  return useQuery<RankedAsset[]>({
    queryKey: ["assets", "top10"],
    queryFn: () => fetchApi<RankedAsset[]>("/assets/top10"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================
// SINGLE ASSET DETAIL
// ============================================
export function useAsset(slug: string) {
  return useQuery<AssetDetail>({
    queryKey: ["asset", slug],
    queryFn: () => fetchApi<AssetDetail>(`/assets/${slug}`),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================
// ASSET CATEGORIES
// ============================================
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      fetchApi<Array<{ id: string; name: string; description: string }>>(
        "/assets/meta/categories"
      ),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// ============================================
// PRICES
// ============================================
export function usePrices(symbols: string) {
  return useQuery<Record<string, PriceData>>({
    queryKey: ["prices", symbols],
    queryFn: () => fetchApi<Record<string, PriceData>>(`/prices/${symbols}`),
    enabled: !!symbols,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refresh every 30s
  });
}

// ============================================
// PRICE HISTORY
// ============================================
export function usePriceHistory(
  symbol: string,
  period: "24h" | "7d" | "30d" | "1y" = "7d"
) {
  return useQuery({
    queryKey: ["priceHistory", symbol, period],
    queryFn: () =>
      fetchApi<{
        symbol: string;
        period: string;
        prices: Array<{ timestamp: number; price: number }>;
      }>(`/prices/history/${symbol}?period=${period}`),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000,
  });
}
