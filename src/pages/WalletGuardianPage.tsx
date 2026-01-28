import { lazy, Suspense } from "react";
import { PageLoader } from "@/components/ui/PageLoader";

// Lazy load the WalletProvider and WalletGuardian together
// This keeps the 347KB web3 bundle out of the main app
const WalletProvider = lazy(() =>
  import("@/components/web3/WalletProvider").then(m => ({ default: m.WalletProvider }))
);
const WalletGuardian = lazy(() => import("./WalletGuardian"));

export default function WalletGuardianPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <WalletProvider>
        <WalletGuardian />
      </WalletProvider>
    </Suspense>
  );
}
