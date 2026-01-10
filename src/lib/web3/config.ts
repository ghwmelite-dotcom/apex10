import { http, createConfig } from "wagmi";
import { mainnet, polygon, bsc, arbitrum, base } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

// Chain configuration for the app
export const SUPPORTED_CHAINS = [mainnet, polygon, bsc, arbitrum, base] as const;

// Chain ID to name mapping
export const CHAIN_NAMES: Record<number, string> = {
  1: "ethereum",
  137: "polygon",
  56: "bsc",
  42161: "arbitrum",
  8453: "base",
};

// Chain ID to explorer mapping
export const CHAIN_EXPLORERS: Record<number, string> = {
  1: "https://etherscan.io",
  137: "https://polygonscan.com",
  56: "https://bscscan.com",
  42161: "https://arbiscan.io",
  8453: "https://basescan.org",
};

// GoPlus chain IDs
export const GOPLUS_CHAIN_IDS: Record<number, string> = {
  1: "1",
  137: "137",
  56: "56",
  42161: "42161",
  8453: "8453",
};

// Create wagmi config with RainbowKit defaults
export const wagmiConfig = getDefaultConfig({
  appName: "Apex10 CryptoDiscover",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "demo",
  chains: SUPPORTED_CHAINS,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
  ssr: false,
});

// ERC20 ABI for approve/allowance functions
export const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    name: "name",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
] as const;

// ERC721/ERC1155 approval ABI
export const NFT_APPROVAL_ABI = [
  {
    name: "setApprovalForAll",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "operator", type: "address" },
      { name: "approved", type: "bool" },
    ],
    outputs: [],
  },
  {
    name: "isApprovedForAll",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "operator", type: "address" },
    ],
    outputs: [{ type: "bool" }],
  },
] as const;

// Known trusted protocols (spender addresses)
export const TRUSTED_PROTOCOLS: Record<string, string> = {
  // Uniswap
  "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45": "Uniswap V3 Router",
  "0x7a250d5630b4cf539739df2c5dacb4c659f2488d": "Uniswap V2 Router",
  // 1inch
  "0x1111111254eeb25477b68fb85ed929f73a960582": "1inch Router",
  // OpenSea
  "0x1e0049783f008a0085193e00003d00cd54003c71": "OpenSea Seaport",
  // Aave
  "0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2": "Aave V3 Pool",
};

// Maximum approval amount (unlimited)
export const MAX_UINT256 =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";
