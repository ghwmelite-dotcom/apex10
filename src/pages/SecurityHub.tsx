import { motion } from "framer-motion";
import { Shield, AlertTriangle, Wallet, BookOpen } from "lucide-react";
import { useSecurityChecklist, useSecurityContent } from "@/hooks/useSecurity";
import { SecurityChecklist } from "@/components/SecurityChecklist";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Skeleton,
} from "@/components/ui";

export default function SecurityHub() {
  const { data: checklist, isLoading: checklistLoading } = useSecurityChecklist();
  const { data: threats, isLoading: threatsLoading } = useSecurityContent("threats");
  const { data: tips, isLoading: tipsLoading } = useSecurityContent("tips");

  return (
    <div className="container-custom py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-accent-success/20 to-accent-primary/20">
            <Shield className="w-6 h-6 text-accent-success" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Security Hub</h1>
            <p className="text-text-muted">
              Protect your assets with comprehensive security education
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Security Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {checklistLoading ? (
              <Card className="p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-32 w-full" />
              </Card>
            ) : checklist ? (
              <SecurityChecklist categories={checklist.categories} />
            ) : null}
          </motion.div>

          {/* Common Threats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent-danger/20">
                    <AlertTriangle className="w-5 h-5 text-accent-danger" />
                  </div>
                  <div>
                    <CardTitle>Common Threats</CardTitle>
                    <CardDescription>
                      Know the risks to avoid them
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {threatsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : threats ? (
                  <div className="space-y-4">
                    {Object.entries(threats).map(([category, items]) => (
                      <div key={category}>
                        <h4 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-3">
                          {category} Threats
                        </h4>
                        <div className="space-y-3">
                          {(items as any[]).map((item) => (
                            <div
                              key={item.id}
                              className="p-4 bg-bg-tertiary/50 rounded-xl border border-border-default"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-semibold text-text-primary">
                                  {item.title}
                                </h5>
                                <Badge
                                  variant={
                                    item.severity === "critical"
                                      ? "danger"
                                      : item.severity === "warning"
                                      ? "warning"
                                      : "info"
                                  }
                                >
                                  {item.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-text-muted">
                                {item.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Best Practices Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent-primary/20">
                    <BookOpen className="w-5 h-5 text-accent-primary" />
                  </div>
                  <CardTitle>Quick Tips</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {tipsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : tips ? (
                  <div className="space-y-3">
                    {Object.values(tips)
                      .flat()
                      .slice(0, 5)
                      .map((tip: any) => (
                        <div
                          key={tip.id}
                          className="p-3 bg-bg-tertiary/50 rounded-lg border border-border-default"
                        >
                          <div className="flex items-start gap-2">
                            <Badge
                              variant={
                                tip.severity === "critical"
                                  ? "danger"
                                  : tip.severity === "warning"
                                  ? "warning"
                                  : "info"
                              }
                              className="mt-0.5 flex-shrink-0"
                            >
                              {tip.severity}
                            </Badge>
                            <p className="text-sm text-text-secondary">
                              {tip.title}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>

          {/* Wallet Guide Teaser */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-glow border-accent-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent-primary/20">
                    <Wallet className="w-5 h-5 text-accent-primary" />
                  </div>
                  <CardTitle>Wallet Guide</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-muted mb-4">
                  Learn about different wallet types and find the best option
                  for your needs.
                </p>
                <a
                  href="/learn#wallets"
                  className="text-accent-primary hover:underline text-sm font-medium"
                >
                  Explore wallet options →
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
