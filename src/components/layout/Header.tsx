import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Shield, BookOpen, Menu, X, Sparkles, Search } from "lucide-react";
import { useState } from "react";
import { MarketPulseMini } from "../MarketPulse";
import { AchievementBadge } from "../AchievementSystem";
import { TimeIndicator } from "../TimeAwareUI";

interface HeaderProps {
  onDiscoveryClick?: () => void;
}

const navItems = [
  { path: "/", label: "Rankings", icon: TrendingUp },
  { path: "/security", label: "Security", icon: Shield },
  { path: "/learn", label: "Learn", icon: BookOpen },
];

export default function Header({ onDiscoveryClick }: HeaderProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-glass border-b border-border-default">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-cyan to-aurora-purple flex items-center justify-center shadow-glow"
            >
              <span className="text-bg-primary font-bold text-sm">A10</span>
            </motion.div>
            <span className="font-bold text-xl text-text-primary group-hover:aurora-text transition-all duration-300">
              Apex10
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 rounded-xl group"
                >
                  <span
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      isActive ? "text-aurora-cyan" : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-aurora-cyan/10 border border-aurora-cyan/20 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Time Indicator */}
            <TimeIndicator />

            {/* Market Pulse */}
            <MarketPulseMini />

            {/* Achievement/Level Badge */}
            <div className="px-2 py-1 rounded-xl bg-bg-tertiary/50 border border-border-default">
              <AchievementBadge />
            </div>

            {/* Command palette trigger */}
            <button
              onClick={() => {
                const event = new KeyboardEvent("keydown", {
                  key: "k",
                  metaKey: true,
                });
                document.dispatchEvent(event);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-tertiary/50 border border-border-default hover:border-aurora-cyan/30 transition-all text-sm text-text-muted hover:text-text-primary"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Search</span>
              <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-bg-primary rounded border border-border-default">
                ⌘K
              </kbd>
            </button>

            {/* Discovery Mode button */}
            <motion.button
              onClick={() => onDiscoveryClick?.()}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 255, 209, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-aurora-cyan/20 to-aurora-purple/20 border border-aurora-cyan/30 text-aurora-cyan text-sm font-medium overflow-hidden cursor-pointer"
              style={{ zIndex: 50 }}
            >
              {/* Animated background pulse */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-aurora-cyan/30 to-aurora-purple/30 pointer-events-none"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <Sparkles className="w-4 h-4 relative z-10 pointer-events-none" />
              <span className="hidden lg:inline relative z-10 pointer-events-none">Discovery</span>
              {/* Sparkle effect */}
              <motion.div
                className="absolute top-0 right-0 w-2 h-2 bg-aurora-cyan rounded-full pointer-events-none"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-border-default"
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-aurora-cyan/10 text-aurora-cyan"
                      : "text-text-muted hover:bg-bg-secondary hover:text-text-primary"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Discovery button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onDiscoveryClick?.();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-aurora-cyan/10 to-aurora-purple/10 text-aurora-cyan"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Discovery Mode</span>
            </button>
          </motion.nav>
        )}
      </div>
    </header>
  );
}
