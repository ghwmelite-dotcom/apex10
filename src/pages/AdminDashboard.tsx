import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Users,
  Trophy,
  TrendingUp,
  Download,
  Trash2,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  BarChart3,
  FileSpreadsheet,
  AlertTriangle,
  Loader2,
  LogOut,
  Calendar,
} from "lucide-react";

interface Lead {
  email: string;
  certificateId: string;
  tier: "gold" | "silver" | "bronze";
  accuracy: number;
  completedAt: string;
  capturedAt: string;
  source: string;
}

interface Stats {
  totalLeads: number;
  tierBreakdown: {
    gold: number;
    silver: number;
    bronze: number;
  };
  averageAccuracy: number;
  leadsByDay: Record<string, number>;
}

const TIER_CONFIG = {
  gold: {
    label: "Gold",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/30",
  },
  silver: {
    label: "Silver",
    color: "text-slate-300",
    bgColor: "bg-slate-300/10",
    borderColor: "border-slate-300/30",
  },
  bronze: {
    label: "Bronze",
    color: "text-amber-600",
    bgColor: "bg-amber-600/10",
    borderColor: "border-amber-600/30",
  },
};

// Auth screen component
function AuthScreen({
  onAuthenticate,
  isLoading,
  error,
}: {
  onAuthenticate: (key: string) => void;
  isLoading: boolean;
  error: string | null;
}) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onAuthenticate(apiKey.trim());
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/30 mb-4">
            <Shield className="w-10 h-10 text-accent-cyan" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
          <p className="text-text-secondary mt-2">Enter your admin key to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-text-secondary mb-2">
              Admin API Key
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type={showKey ? "text" : "password"}
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="apex10-admin-sk_..."
                className="w-full pl-11 pr-12 py-3 rounded-xl bg-bg-secondary border border-border-primary focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/50 text-text-primary placeholder:text-text-muted outline-none transition-colors"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading || !apiKey.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-purple text-bg-primary font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Access Dashboard
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// Stats card component
function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-bg-secondary border border-border-primary/50"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-muted mb-1">{label}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
          {subValue && <p className="text-sm text-text-secondary mt-1">{subValue}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}

// Tier badge component
function TierBadge({ tier }: { tier: "gold" | "silver" | "bronze" }) {
  const config = TIER_CONFIG[tier];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color} border ${config.borderColor}`}
    >
      <Trophy className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
}

// Main dashboard component
function Dashboard({
  apiKey,
  onLogout,
}: {
  apiKey: string;
  onLogout: () => void;
}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [leadsRes, statsRes] = await Promise.all([
        fetch("/api/admin/leads", {
          headers: { "X-Admin-Key": apiKey },
        }),
        fetch("/api/admin/leads/stats", {
          headers: { "X-Admin-Key": apiKey },
        }),
      ]);

      if (!leadsRes.ok || !statsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const leadsData = await leadsRes.json();
      const statsData = await statsRes.json();

      setLeads(leadsData.leads || []);
      setStats(statsData.stats || null);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExportCSV = async () => {
    try {
      const response = await fetch("/api/admin/leads/export", {
        headers: { "X-Admin-Key": apiKey },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `apex10-leads-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const handleExportJSON = async () => {
    try {
      const response = await fetch("/api/admin/leads/export?format=json", {
        headers: { "X-Admin-Key": apiKey },
      });
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `apex10-leads-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const handleDelete = async (certificateId: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    setDeletingId(certificateId);
    try {
      const response = await fetch(`/api/admin/leads/${certificateId}`, {
        method: "DELETE",
        headers: { "X-Admin-Key": apiKey },
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-accent-cyan animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border-primary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20">
                <Shield className="w-5 h-5 text-accent-cyan" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-text-primary">Admin Dashboard</h1>
                <p className="text-xs text-text-muted">Apex10 Certificate Leads</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchData}
                className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-secondary hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2"
          >
            <AlertTriangle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Users}
              label="Total Leads"
              value={stats.totalLeads}
              color="bg-accent-cyan/10 text-accent-cyan"
            />
            <StatCard
              icon={TrendingUp}
              label="Avg Accuracy"
              value={`${stats.averageAccuracy}%`}
              color="bg-quantum-green/10 text-quantum-green"
            />
            <StatCard
              icon={Trophy}
              label="Gold Tier"
              value={stats.tierBreakdown.gold}
              subValue={`${stats.tierBreakdown.silver} Silver, ${stats.tierBreakdown.bronze} Bronze`}
              color="bg-yellow-400/10 text-yellow-400"
            />
            <StatCard
              icon={Calendar}
              label="Today"
              value={stats.leadsByDay[new Date().toISOString().split("T")[0]] || 0}
              subValue="new leads"
              color="bg-accent-purple/10 text-accent-purple"
            />
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-text-primary">
            All Leads ({leads.length})
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-secondary hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-secondary hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-bg-secondary rounded-2xl border border-border-primary/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-primary/50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Accuracy
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Captured
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary/30">
                <AnimatePresence>
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                        No leads captured yet
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <motion.tr
                        key={lead.certificateId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-bg-tertiary/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="text-text-primary font-medium">{lead.email}</span>
                        </td>
                        <td className="px-6 py-4">
                          <TierBadge tier={lead.tier} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  lead.accuracy >= 95
                                    ? "bg-yellow-400"
                                    : lead.accuracy >= 85
                                    ? "bg-slate-300"
                                    : "bg-amber-600"
                                }`}
                                style={{ width: `${lead.accuracy}%` }}
                              />
                            </div>
                            <span className="text-sm text-text-secondary">{lead.accuracy}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-text-secondary">
                            {formatDate(lead.capturedAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(lead.certificateId)}
                            disabled={deletingId === lead.certificateId}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors disabled:opacity-50"
                            title="Delete lead"
                          >
                            {deletingId === lead.certificateId ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart placeholder - leads by day */}
        {stats && Object.keys(stats.leadsByDay).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 p-6 rounded-2xl bg-bg-secondary border border-border-primary/50"
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-accent-cyan" />
              <h3 className="text-lg font-semibold text-text-primary">Leads by Day (Last 7 Days)</h3>
            </div>
            <div className="flex items-end justify-between gap-2 h-32">
              {Object.entries(stats.leadsByDay).map(([date, count]) => {
                const maxCount = Math.max(...Object.values(stats.leadsByDay), 1);
                const height = (count / maxCount) * 100;
                const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" });

                return (
                  <div key={date} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center justify-end h-24">
                      <span className="text-xs text-text-primary mb-1">{count}</span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(height, 4)}%` }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="w-full max-w-[40px] bg-gradient-to-t from-accent-cyan to-accent-purple rounded-t-md"
                      />
                    </div>
                    <span className="text-xs text-text-muted">{dayName}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

// Main export
export default function AdminDashboard() {
  const [apiKey, setApiKey] = useState<string | null>(() => {
    // Check sessionStorage for existing key
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("admin_api_key");
    }
    return null;
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleAuthenticate = async (key: string) => {
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      // Verify the key works
      const response = await fetch("/api/admin/leads/stats", {
        headers: { "X-Admin-Key": key },
      });

      if (response.status === 401) {
        setAuthError("Invalid admin key");
        return;
      }

      if (!response.ok) {
        setAuthError("Failed to authenticate");
        return;
      }

      // Store key in sessionStorage
      sessionStorage.setItem("admin_api_key", key);
      setApiKey(key);
    } catch (err) {
      setAuthError("Connection error. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_api_key");
    setApiKey(null);
  };

  if (!apiKey) {
    return (
      <AuthScreen
        onAuthenticate={handleAuthenticate}
        isLoading={isAuthenticating}
        error={authError}
      />
    );
  }

  return <Dashboard apiKey={apiKey} onLogout={handleLogout} />;
}
