import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/layout/Layout";
import { AchievementProvider } from "./components/AchievementSystem";
import { TimeAwareProvider } from "./components/TimeAwareUI";
import { AmbientProvider } from "./components/AmbientMode";
import { SplashScreen } from "./components/SplashScreen";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { PageLoader } from "./components/ui/PageLoader";
import { WalletProvider } from "./components/web3/WalletProvider";

// Lazy load pages for code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AssetDetail = lazy(() => import("./pages/AssetDetail"));
const SecurityHub = lazy(() => import("./pages/SecurityHub"));
const LearnCenter = lazy(() => import("./pages/LearnCenter"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ContractScanner = lazy(() => import("./pages/ContractScanner"));
const WalletGuardian = lazy(() => import("./pages/WalletGuardian"));
const VerifyPage = lazy(() => import("./pages/VerifyPage"));
const NewsHub = lazy(() => import("./pages/NewsHub"));

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as installed PWA
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setIsStandalone(standalone);

    // Only show splash for PWA mode, or briefly for web
    if (standalone) {
      // PWA: Show splash for 2.5 seconds
      const timer = setTimeout(() => setShowSplash(false), 2500);
      return () => clearTimeout(timer);
    } else {
      // Web: Quick fade in
      const timer = setTimeout(() => setShowSplash(false), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <WalletProvider>
      <TimeAwareProvider>
        <AchievementProvider>
          <AmbientProvider>
          {/* Splash Screen */}
          <AnimatePresence>
            {showSplash && (
              <SplashScreen
                onComplete={() => setShowSplash(false)}
                duration={isStandalone ? 2500 : 800}
              />
            )}
          </AnimatePresence>

          {/* Offline Indicator */}
          <OfflineIndicator />

          {/* Main App */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Admin route - outside Layout */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Verification page - outside Layout */}
              <Route path="/verify/:tokenId" element={<VerifyPage />} />

              {/* Main app routes with Layout */}
              <Route
                path="*"
                element={
                  <Layout>
                    <AnimatePresence mode="wait">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/asset/:slug" element={<AssetDetail />} />
                        <Route path="/security" element={<SecurityHub />} />
                        <Route path="/learn" element={<LearnCenter />} />
                        <Route path="/scanner" element={<ContractScanner />} />
                        <Route path="/wallet-guardian" element={<WalletGuardian />} />
                        <Route path="/news" element={<NewsHub />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AnimatePresence>
                  </Layout>
                }
              />
            </Routes>
          </Suspense>

          {/* PWA Install Prompt */}
          <PWAInstallPrompt />
          </AmbientProvider>
        </AchievementProvider>
      </TimeAwareProvider>
    </WalletProvider>
  );
}
