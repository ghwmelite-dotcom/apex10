import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/layout/Layout";
import { AchievementProvider } from "./components/AchievementSystem";
import { TimeAwareProvider } from "./components/TimeAwareUI";
import { AmbientProvider } from "./components/AmbientMode";
import { SplashScreen } from "./components/SplashScreen";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { OfflineIndicator } from "./components/OfflineIndicator";
import Dashboard from "./pages/Dashboard";
import AssetDetail from "./pages/AssetDetail";
import SecurityHub from "./pages/SecurityHub";
import LearnCenter from "./pages/LearnCenter";
import NotFound from "./pages/NotFound";

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
          <Layout>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/asset/:slug" element={<AssetDetail />} />
                <Route path="/security" element={<SecurityHub />} />
                <Route path="/learn" element={<LearnCenter />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </Layout>

          {/* PWA Install Prompt */}
          <PWAInstallPrompt />
        </AmbientProvider>
      </AchievementProvider>
    </TimeAwareProvider>
  );
}
