import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import AssetDetail from "./pages/AssetDetail";
import SecurityHub from "./pages/SecurityHub";
import LearnCenter from "./pages/LearnCenter";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
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
  );
}
