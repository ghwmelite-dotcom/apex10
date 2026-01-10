import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { ContractAnalysisResult, ChainId } from "../api/types";

interface ScanHistoryItem {
  address: string;
  chain: ChainId;
  riskScore: number;
  riskLevel: string;
  tokenName: string;
  tokenSymbol: string;
  scannedAt: string;
}

const HISTORY_KEY = "apex10_scan_history";
const MAX_HISTORY = 20;

// Get scan history from localStorage
function getStoredHistory(): ScanHistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save scan history to localStorage
function saveToHistory(item: ScanHistoryItem) {
  const history = getStoredHistory();
  const existingIndex = history.findIndex(
    (h) => h.address.toLowerCase() === item.address.toLowerCase() && h.chain === item.chain
  );

  if (existingIndex >= 0) {
    history.splice(existingIndex, 1);
  }

  history.unshift(item);
  const trimmed = history.slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

// Clear history
function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

// Analyze contract API call
async function analyzeContractApi(
  address: string,
  chain: ChainId
): Promise<{ data: ContractAnalysisResult; cached: boolean }> {
  const response = await fetch("/api/scanner/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, chain }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Analysis failed");
  }

  return response.json();
}

// Quick check API call
async function quickCheckApi(
  address: string,
  chain: ChainId
): Promise<{ data: { riskScore: number; riskLevel: string; isHoneypot: boolean }; cached: boolean }> {
  const response = await fetch(`/api/scanner/quick-check/${address}?chain=${chain}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Quick check failed");
  }

  return response.json();
}

// Main hook for contract scanning
export function useContractScanner() {
  const [currentAddress, setCurrentAddress] = useState("");
  const [currentChain, setCurrentChain] = useState<ChainId>("ethereum");

  const analysisMutation = useMutation({
    mutationFn: ({ address, chain }: { address: string; chain: ChainId }) =>
      analyzeContractApi(address, chain),
    onSuccess: (data) => {
      if (data.data) {
        saveToHistory({
          address: data.data.address,
          chain: data.data.chain,
          riskScore: data.data.riskScore,
          riskLevel: data.data.riskLevel,
          tokenName: data.data.tokenInfo?.name || "Unknown",
          tokenSymbol: data.data.tokenInfo?.symbol || "???",
          scannedAt: new Date().toISOString(),
        });
      }
    },
  });

  const scanContract = useCallback(
    (address: string, chain: ChainId) => {
      setCurrentAddress(address);
      setCurrentChain(chain);
      return analysisMutation.mutateAsync({ address, chain });
    },
    [analysisMutation]
  );

  const reset = useCallback(() => {
    setCurrentAddress("");
    analysisMutation.reset();
  }, [analysisMutation]);

  return {
    scanContract,
    reset,
    currentAddress,
    currentChain,
    setCurrentChain,
    result: analysisMutation.data?.data,
    isLoading: analysisMutation.isPending,
    error: analysisMutation.error,
    isFromCache: analysisMutation.data?.cached,
  };
}

// Hook for quick check
export function useQuickCheck(address: string, chain: ChainId, enabled = true) {
  return useQuery({
    queryKey: ["quickCheck", address, chain],
    queryFn: () => quickCheckApi(address, chain),
    enabled: enabled && !!address && /^0x[a-fA-F0-9]{40}$/.test(address),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

// Hook for scan history
export function useScanHistory() {
  const [history, setHistory] = useState<ScanHistoryItem[]>(getStoredHistory);

  const refresh = useCallback(() => {
    setHistory(getStoredHistory());
  }, []);

  const clear = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  const removeItem = useCallback((address: string, chain: ChainId) => {
    const history = getStoredHistory();
    const filtered = history.filter(
      (h) => !(h.address.toLowerCase() === address.toLowerCase() && h.chain === chain)
    );
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    setHistory(filtered);
  }, []);

  return { history, refresh, clear, removeItem };
}

// Educational content for risk factors
export const RISK_EDUCATION: Record<
  string,
  { title: string; explanation: string; learnMore: string }
> = {
  honeypot: {
    title: "Honeypot Detection",
    explanation:
      "A honeypot is a scam where you can buy a token but cannot sell it. The contract is designed to trap your funds permanently.",
    learnMore: "/learn#honeypot-scams",
  },
  rugPull: {
    title: "Rug Pull Indicators",
    explanation:
      "Rug pull indicators show if the contract owner has powers that could allow them to drain liquidity or manipulate the token.",
    learnMore: "/learn#rug-pulls",
  },
  taxes: {
    title: "Buy/Sell Tax Analysis",
    explanation:
      "Some tokens have built-in taxes on trades. High taxes (>10%) can significantly reduce your profits or even cause losses.",
    learnMore: "/learn#token-taxes",
  },
  liquidity: {
    title: "Liquidity Analysis",
    explanation:
      "Liquidity is the amount of funds available for trading. Low or unlocked liquidity means the token could become untradeable quickly.",
    learnMore: "/learn#liquidity",
  },
  ownership: {
    title: "Ownership Privileges",
    explanation:
      "Contract owners may have special privileges like minting new tokens, pausing trading, or changing tax rates.",
    learnMore: "/learn#contract-ownership",
  },
  mintable: {
    title: "Minting Capability",
    explanation:
      "If a contract can mint new tokens, the supply can be increased at any time, potentially diluting your holdings to zero.",
    learnMore: "/learn#token-inflation",
  },
  proxy: {
    title: "Proxy Contract",
    explanation:
      "Proxy contracts can be upgraded, meaning the contract logic can change after deployment. This adds risk as behavior can change.",
    learnMore: "/learn#proxy-contracts",
  },
};
