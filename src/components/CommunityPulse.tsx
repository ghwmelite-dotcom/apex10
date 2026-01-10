import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  MessageCircle,
  Heart,
  TrendingUp,
  Globe,
  Activity,
  Eye,
  Zap,
  Award,
  BookOpen,
  Shield,
  Clock,
} from "lucide-react";

// Simulated community data
interface CommunityActivity {
  id: string;
  type: "learning" | "achievement" | "discussion" | "security";
  message: string;
  timestamp: Date;
  icon: typeof Users;
  color: string;
}

interface CommunityStats {
  activeUsers: number;
  lessonsCompleted: number;
  discussionsPosts: number;
  securityScore: number;
}

// Generate random community activity
function generateActivity(): CommunityActivity {
  const activities = [
    {
      type: "learning" as const,
      messages: [
        "Someone completed the Bitcoin Basics course",
        "A learner finished the DeFi fundamentals module",
        "New user started their first learning path",
        "Someone earned 50 XP from quiz completion",
      ],
      icon: BookOpen,
      color: "text-aurora-cyan",
    },
    {
      type: "achievement" as const,
      messages: [
        "A user unlocked 'Crypto Scholar' badge",
        "Someone reached Level 5!",
        "'Phishing Hunter' achievement unlocked",
        "New 'Quiz Master' in the community",
      ],
      icon: Award,
      color: "text-solar-gold",
    },
    {
      type: "discussion" as const,
      messages: [
        "New discussion: 'Best practices for cold storage'",
        "Someone asked about DeFi yield strategies",
        "Hot topic: Ethereum scaling solutions",
        "Community debate: Bitcoin vs Ethereum",
      ],
      icon: MessageCircle,
      color: "text-aurora-purple",
    },
    {
      type: "security" as const,
      messages: [
        "User completed security checklist",
        "Someone passed the phishing test",
        "New wallet security guide reader",
        "Security awareness quiz completed",
      ],
      icon: Shield,
      color: "text-quantum-green",
    },
  ];

  const category = activities[Math.floor(Math.random() * activities.length)];
  const message = category.messages[Math.floor(Math.random() * category.messages.length)];

  return {
    id: crypto.randomUUID(),
    type: category.type,
    message,
    timestamp: new Date(),
    icon: category.icon,
    color: category.color,
  };
}

// Generate initial stats
function generateStats(): CommunityStats {
  return {
    activeUsers: Math.floor(Math.random() * 500) + 1200,
    lessonsCompleted: Math.floor(Math.random() * 200) + 5000,
    discussionsPosts: Math.floor(Math.random() * 50) + 300,
    securityScore: Math.floor(Math.random() * 10) + 85,
  };
}

export function CommunityPulse() {
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [stats, setStats] = useState<CommunityStats>(generateStats);
  const [isLive, setIsLive] = useState(true);

  // Generate initial activities
  useEffect(() => {
    const initial = Array.from({ length: 5 }, generateActivity);
    setActivities(initial);
  }, []);

  // Simulate live activity
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities((prev) => [newActivity, ...prev.slice(0, 9)]);

      // Randomly update stats
      setStats((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        lessonsCompleted: prev.lessonsCompleted + Math.floor(Math.random() * 3),
        discussionsPosts: prev.discussionsPosts + (Math.random() > 0.7 ? 1 : 0),
        securityScore: Math.min(100, Math.max(80, prev.securityScore + (Math.random() > 0.5 ? 0.1 : -0.1))),
      }));
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-aurora-purple/10 to-aurora-cyan/10 border-b border-border-default">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Globe className="w-6 h-6 text-aurora-purple" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-quantum-green rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Community Pulse</h3>
              <p className="text-xs text-text-muted">Live activity feed</p>
            </div>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              isLive
                ? "bg-quantum-green/20 text-quantum-green"
                : "bg-bg-tertiary text-text-muted"
            }`}
          >
            {isLive ? (
              <>
                <Activity className="w-3 h-3" />
                Live
              </>
            ) : (
              <>
                <Clock className="w-3 h-3" />
                Paused
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <StatCard
          icon={Users}
          label="Active Now"
          value={stats.activeUsers.toLocaleString()}
          color="text-aurora-cyan"
          trend={Math.random() > 0.5}
        />
        <StatCard
          icon={BookOpen}
          label="Lessons Completed"
          value={stats.lessonsCompleted.toLocaleString()}
          color="text-aurora-purple"
          trend={true}
        />
        <StatCard
          icon={MessageCircle}
          label="Discussions"
          value={stats.discussionsPosts.toLocaleString()}
          color="text-solar-gold"
          trend={Math.random() > 0.3}
        />
        <StatCard
          icon={Shield}
          label="Security Score"
          value={`${stats.securityScore.toFixed(1)}%`}
          color="text-quantum-green"
          trend={stats.securityScore > 90}
        />
      </div>

      {/* Activity feed */}
      <div className="p-4 pt-0">
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-bg-tertiary/50"
                >
                  <div className={`flex-shrink-0 ${activity.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-text-secondary flex-1">{activity.message}</p>
                  <span className="text-xs text-text-muted flex-shrink-0">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer engagement */}
      <div className="p-4 border-t border-border-default bg-bg-tertiary/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-text-muted hover:text-aurora-cyan transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Like</span>
            </button>
            <button className="flex items-center gap-2 text-text-muted hover:text-aurora-purple transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">Discuss</span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-text-muted">
            <Eye className="w-4 h-4" />
            <span className="text-sm">{Math.floor(Math.random() * 100) + 50} watching</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  trend,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  color: string;
  trend: boolean;
}) {
  return (
    <div className="p-3 rounded-xl bg-bg-tertiary/50">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-text-muted">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-text-primary">{value}</span>
        {trend && (
          <TrendingUp className="w-4 h-4 text-quantum-green" />
        )}
      </div>
    </div>
  );
}

// Compact version for sidebar
export function CommunityPulseMini() {
  const [stats, setStats] = useState({
    users: Math.floor(Math.random() * 500) + 1200,
    activity: Math.floor(Math.random() * 50) + 100,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        users: prev.users + Math.floor(Math.random() * 5) - 2,
        activity: prev.activity + Math.floor(Math.random() * 3),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4 px-3 py-2 rounded-lg bg-bg-tertiary/50">
      <div className="flex items-center gap-2">
        <motion.div
          className="w-2 h-2 bg-quantum-green rounded-full"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-sm text-text-muted">
          <span className="font-medium text-text-primary">{stats.users.toLocaleString()}</span> online
        </span>
      </div>
      <div className="flex items-center gap-1 text-aurora-cyan">
        <Zap className="w-3 h-3" />
        <span className="text-xs">{stats.activity} actions/min</span>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 120) return "1m ago";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;

  return `${Math.floor(seconds / 3600)}h ago`;
}
