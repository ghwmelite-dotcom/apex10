import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  Shield,
  BookOpen,
  Zap,
  Sparkles,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { useTop10Assets } from "@/hooks/useAssets";

// Crypto symbol icons (using first letter as fallback)
const CRYPTO_COLORS: Record<string, string> = {
  BTC: "#F7931A",
  ETH: "#627EEA",
  SOL: "#00FFA3",
  AVAX: "#E84142",
  LINK: "#375BD2",
  AAVE: "#B6509E",
  UNI: "#FF007A",
  ARB: "#28A0F0",
  OP: "#FF0420",
  MATIC: "#8247E5",
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: assets } = useTop10Assets();

  // Toggle the menu when ⌘K or Ctrl+K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      {/* Keyboard shortcut hint */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-tertiary/50 border border-border-default hover:border-border-hover transition-colors text-sm text-text-muted"
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-bg-primary rounded border border-border-default">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Command Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="fixed left-1/2 top-[15%] z-50 w-full max-w-xl -translate-x-1/2"
            >
              <Command
                className="overflow-hidden rounded-2xl border border-border-default bg-bg-secondary/95 backdrop-blur-xl shadow-2xl"
                loop
              >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-border-default">
                  <Search className="w-5 h-5 text-aurora-cyan" />
                  <Command.Input
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Search assets, pages, or actions..."
                    className="flex-1 bg-transparent text-lg text-text-primary placeholder:text-text-muted focus:outline-none"
                  />
                  <kbd className="px-2 py-1 text-xs text-text-muted bg-bg-tertiary rounded border border-border-default">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <Command.List className="max-h-[400px] overflow-y-auto p-2">
                  <Command.Empty className="py-8 text-center text-text-muted">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-aurora-purple opacity-50" />
                    No results found.
                  </Command.Empty>

                  {/* Quick Actions */}
                  <Command.Group heading="Quick Actions" className="px-2 py-1.5 text-xs font-medium text-text-muted uppercase tracking-wider">
                    <CommandItem
                      icon={<TrendingUp className="w-4 h-4" />}
                      label="View Top 10 Rankings"
                      shortcut="⌘1"
                      onSelect={() => runCommand(() => navigate("/"))}
                    />
                    <CommandItem
                      icon={<Shield className="w-4 h-4" />}
                      label="Open Security Hub"
                      shortcut="⌘2"
                      onSelect={() => runCommand(() => navigate("/security"))}
                    />
                    <CommandItem
                      icon={<BookOpen className="w-4 h-4" />}
                      label="Go to Learn Center"
                      shortcut="⌘3"
                      onSelect={() => runCommand(() => navigate("/learn"))}
                    />
                    <CommandItem
                      icon={<BarChart3 className="w-4 h-4" />}
                      label="View Methodology"
                      onSelect={() => runCommand(() => navigate("/?methodology=true"))}
                    />
                  </Command.Group>

                  {/* Assets */}
                  {assets && assets.length > 0 && (
                    <Command.Group heading="Assets" className="px-2 py-1.5 text-xs font-medium text-text-muted uppercase tracking-wider mt-2">
                      {assets.map((asset) => (
                        <CommandItem
                          key={asset.id}
                          icon={
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                              style={{ backgroundColor: CRYPTO_COLORS[asset.symbol] || "#6366f1" }}
                            >
                              {asset.symbol.charAt(0)}
                            </div>
                          }
                          label={asset.name}
                          description={asset.symbol}
                          badge={`#${asset.rank}`}
                          onSelect={() => runCommand(() => navigate(`/asset/${asset.slug}`))}
                        />
                      ))}
                    </Command.Group>
                  )}

                  {/* Features */}
                  <Command.Group heading="Features" className="px-2 py-1.5 text-xs font-medium text-text-muted uppercase tracking-wider mt-2">
                    <CommandItem
                      icon={<Zap className="w-4 h-4 text-solar-gold" />}
                      label="Toggle Orbital View"
                      description="Visualize rankings in 3D space"
                      onSelect={() => runCommand(() => {})}
                    />
                    <CommandItem
                      icon={<Sparkles className="w-4 h-4 text-aurora-purple" />}
                      label="Start Discovery Mode"
                      description="Guided tour of the platform"
                      onSelect={() => runCommand(() => {})}
                    />
                  </Command.Group>
                </Command.List>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-border-default bg-bg-tertiary/30">
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-bg-primary rounded border border-border-default">↑↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-bg-primary rounded border border-border-default">↵</kbd>
                      Select
                    </span>
                  </div>
                  <span className="text-xs text-aurora-cyan">Apex10 Command</span>
                </div>
              </Command>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Command Item Component
function CommandItem({
  icon,
  label,
  description,
  shortcut,
  badge,
  onSelect,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  shortcut?: string;
  badge?: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors data-[selected=true]:bg-aurora-cyan/10 data-[selected=true]:text-aurora-cyan group"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-bg-tertiary group-data-[selected=true]:bg-aurora-cyan/20">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{label}</span>
          {badge && (
            <span className="px-1.5 py-0.5 text-xs bg-solar-gold/20 text-solar-gold rounded">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-text-muted truncate">{description}</p>
        )}
      </div>
      {shortcut && (
        <kbd className="px-2 py-1 text-xs bg-bg-primary rounded border border-border-default text-text-muted">
          {shortcut}
        </kbd>
      )}
      <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-data-[selected=true]:opacity-100 transition-opacity" />
    </Command.Item>
  );
}
