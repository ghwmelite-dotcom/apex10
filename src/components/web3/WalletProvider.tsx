import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "../../lib/web3/config";
import "@rainbow-me/rainbowkit/styles.css";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Aurora-themed dark theme for RainbowKit
const auroraTheme = darkTheme({
  accentColor: "#00FFD1", // Aurora cyan
  accentColorForeground: "#030712", // Dark background
  borderRadius: "medium",
  overlayBlur: "small",
});

// Customize theme colors to match Apex10
const customTheme = {
  ...auroraTheme,
  colors: {
    ...auroraTheme.colors,
    modalBackground: "#0a0f1a",
    modalBorder: "rgba(0, 255, 209, 0.2)",
    profileForeground: "#0a0f1a",
    connectButtonBackground: "#0a0f1a",
    connectButtonInnerBackground: "rgba(0, 255, 209, 0.1)",
    menuItemBackground: "rgba(0, 255, 209, 0.1)",
  },
  shadows: {
    ...auroraTheme.shadows,
    dialog: "0 0 40px rgba(0, 255, 209, 0.15)",
    connectButton: "0 0 20px rgba(0, 255, 209, 0.1)",
  },
};

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={customTheme}
          modalSize="compact"
          appInfo={{
            appName: "Apex10 CryptoDiscover",
            learnMoreUrl: "https://apex10.pages.dev/learn",
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default WalletProvider;
