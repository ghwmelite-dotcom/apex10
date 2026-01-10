import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Shield,
  BookOpen,
  Menu,
  X,
  Sparkles,
  Search,
  ScanLine,
  Wallet,
  Newspaper,
  ChevronDown,
  Command,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onDiscoveryClick?: () => void;
}

const navItems = [
  { path: "/", label: "Rankings", icon: TrendingUp },
  { path: "/news", label: "News", icon: Newspaper },
  { path: "/security", label: "Security", icon: Shield },
  { path: "/scanner", label: "Scanner", icon: ScanLine },
  { path: "/wallet-guardian", label: "Guardian", icon: Wallet },
  { path: "/learn", label: "Learn", icon: BookOpen },
];

export default function Header({ onDiscoveryClick }: HeaderProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for header style change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openCommandPalette = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-bg-primary/80 backdrop-blur-xl border-b border-border-default shadow-lg shadow-black/5"
          : "bg-transparent"
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-aurora-cyan via-aurora-purple to-aurora-pink flex items-center justify-center shadow-glow-sm overflow-hidden"
            >
              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-bg-primary font-black text-xs tracking-tight relative z-10">
                A10
              </span>
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-text-primary leading-none group-hover:text-aurora-cyan transition-colors">
                Apex10
              </span>
              <span className="text-[10px] text-text-muted leading-none mt-0.5 hidden sm:block">
                Crypto Discovery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Clean pill style */}
          <nav className="hidden lg:flex items-center">
            <div className="flex items-center bg-bg-secondary/50 rounded-2xl p-1 border border-border-default/50">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-4 py-2 rounded-xl"
                  >
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors relative z-10",
                        isActive
                          ? "text-text-primary"
                          : "text-text-muted hover:text-text-secondary"
                      )}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 bg-bg-primary rounded-xl shadow-sm border border-border-default"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right side - Simplified */}
          <div className="hidden md:flex items-center gap-2">
            {/* Search - More subtle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openCommandPalette}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-secondary/50 border border-border-default/50 hover:border-border-default hover:bg-bg-secondary transition-all text-text-muted hover:text-text-secondary"
              aria-label="Search (Cmd+K)"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm hidden xl:inline">Search</span>
              <div className="hidden xl:flex items-center gap-0.5 ml-1">
                <kbd className="px-1.5 py-0.5 text-[10px] bg-bg-tertiary rounded border border-border-default font-mono">
                  <Command className="w-2.5 h-2.5 inline" />
                </kbd>
                <kbd className="px-1.5 py-0.5 text-[10px] bg-bg-tertiary rounded border border-border-default font-mono">
                  K
                </kbd>
              </div>
            </motion.button>

            {/* Discovery - Hero button */}
            <motion.button
              onClick={() => onDiscoveryClick?.()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl overflow-hidden group"
              aria-label="Open Discovery Mode"
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-aurora-cyan to-aurora-purple opacity-90 group-hover:opacity-100 transition-opacity" />

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              <Sparkles className="w-4 h-4 text-bg-primary relative z-10" />
              <span className="text-sm font-semibold text-bg-primary relative z-10">
                Discover
              </span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile search */}
            <button
              onClick={openCommandPalette}
              className="p-2 rounded-xl hover:bg-bg-secondary transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-text-muted" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 text-text-primary" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5 text-text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Full screen overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-16 z-50 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg-primary/95 backdrop-blur-xl"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu content */}
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="relative container-custom py-6"
            >
              <div className="space-y-1">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all",
                          isActive
                            ? "bg-aurora-cyan/10 text-aurora-cyan"
                            : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            isActive
                              ? "bg-aurora-cyan/20"
                              : "bg-bg-secondary"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile Discovery button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 pt-6 border-t border-border-default"
              >
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onDiscoveryClick?.();
                  }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-aurora-cyan to-aurora-purple text-bg-primary font-semibold text-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  Discovery Mode
                </button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
