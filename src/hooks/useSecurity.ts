import { useQuery } from "@tanstack/react-query";

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
// SECURITY CHECKLIST
// ============================================
interface ChecklistItem {
  id: string;
  label: string;
  priority: "critical" | "high" | "medium";
}

interface ChecklistCategory {
  name: string;
  items: ChecklistItem[];
}

interface SecurityChecklist {
  categories: ChecklistCategory[];
}

export function useSecurityChecklist() {
  return useQuery<SecurityChecklist>({
    queryKey: ["security", "checklist"],
    queryFn: () => fetchApi<SecurityChecklist>("/security/checklist"),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// ============================================
// SECURITY CONTENT (Tips, Threats)
// ============================================
interface SecurityContentItem {
  id: number;
  type: string;
  category: string;
  title: string;
  content: string;
  severity?: string;
  order: number;
}

export function useSecurityContent(type: "tips" | "threats") {
  const endpoint = type === "tips" ? "/security/best-practices" : "/security/threats";

  return useQuery<Record<string, SecurityContentItem[]>>({
    queryKey: ["security", type],
    queryFn: () => fetchApi<Record<string, SecurityContentItem[]>>(endpoint),
    staleTime: 60 * 60 * 1000,
  });
}

// ============================================
// WALLET GUIDES
// ============================================
interface WalletGuide {
  id: number;
  type: string;
  category: string;
  title: string;
  content: string;
  metadata?: {
    pros?: string[];
    cons?: string[];
    priceRange?: string;
  };
}

export function useWalletGuides() {
  return useQuery<Record<string, WalletGuide[]>>({
    queryKey: ["security", "wallets"],
    queryFn: () => fetchApi<Record<string, WalletGuide[]>>("/security/wallets"),
    staleTime: 60 * 60 * 1000,
  });
}

// ============================================
// ACQUISITION GUIDES
// ============================================
interface AcquisitionGuide {
  id: number;
  type: string;
  category: string;
  title: string;
  content: string;
}

export function useAcquisitionGuides() {
  return useQuery<AcquisitionGuide[]>({
    queryKey: ["security", "acquisition"],
    queryFn: () => fetchApi<AcquisitionGuide[]>("/security/acquisition-guide"),
    staleTime: 60 * 60 * 1000,
  });
}
