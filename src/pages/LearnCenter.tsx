import { motion } from "framer-motion";
import { BookOpen, Wallet, ShoppingCart, Shield } from "lucide-react";
import { useWalletGuides, useAcquisitionGuides } from "@/hooks/useSecurity";
import {
  Card,
  Badge,
  Button,
  Skeleton,
} from "@/components/ui";

export default function LearnCenter() {
  const { data: walletGuides, isLoading: walletsLoading } = useWalletGuides();
  const { data: acquisitionGuides, isLoading: acquisitionLoading } = useAcquisitionGuides();

  return (
    <div className="container-custom py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-accent-secondary/20 to-accent-primary/20">
            <BookOpen className="w-6 h-6 text-accent-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Learn Center</h1>
            <p className="text-text-muted">
              Step-by-step guides for safe crypto acquisition and management
            </p>
          </div>
        </div>
      </motion.div>

      {/* Wallet Guides Section */}
      <motion.section
        id="wallets"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="w-5 h-5 text-accent-primary" />
          <h2 className="text-xl font-semibold text-text-primary">
            Wallet Guides
          </h2>
        </div>

        {walletsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : walletGuides ? (
          <div className="space-y-8">
            {Object.entries(walletGuides).map(([category, guides]) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">
                  {category} Wallets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(guides as any[]).map((guide) => {
                    const metadata = guide.metadata as {
                      pros?: string[];
                      cons?: string[];
                      priceRange?: string;
                    } | null;

                    return (
                      <Card key={guide.id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-bg-tertiary flex items-center justify-center">
                              <Wallet className="w-6 h-6 text-accent-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-text-primary">
                                {guide.title}
                              </h4>
                              {metadata?.priceRange && (
                                <span className="text-sm text-text-muted">
                                  {metadata.priceRange}
                                </span>
                              )}
                            </div>
                          </div>
                          <Badge variant="info">{category}</Badge>
                        </div>

                        <p className="text-sm text-text-muted mb-4">
                          {guide.content}
                        </p>

                        {metadata?.pros && (
                          <div className="mb-3">
                            <span className="text-xs font-medium text-accent-success">
                              Pros:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {metadata.pros.map((pro, i) => (
                                <Badge key={i} variant="success" className="text-xs">
                                  {pro}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {metadata?.cons && (
                          <div>
                            <span className="text-xs font-medium text-accent-warning">
                              Cons:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {metadata.cons.map((con, i) => (
                                <Badge key={i} variant="warning" className="text-xs">
                                  {con}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </motion.section>

      {/* Acquisition Guides Section */}
      <motion.section
        id="acquisition"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart className="w-5 h-5 text-accent-primary" />
          <h2 className="text-xl font-semibold text-text-primary">
            How to Buy Crypto
          </h2>
        </div>

        {acquisitionLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-2xl" />
            ))}
          </div>
        ) : acquisitionGuides ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {acquisitionGuides.map((guide: any, index: number) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent-primary/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-accent-primary">
                        {index + 1}
                      </span>
                    </div>
                    <Badge>{guide.category}</Badge>
                  </div>

                  <h3 className="font-semibold text-text-primary mb-2">
                    {guide.title}
                  </h3>

                  <p className="text-sm text-text-muted">{guide.content}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : null}
      </motion.section>

      {/* Safety Reminder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <Card className="p-6 bg-gradient-glow border-accent-warning/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-accent-warning/20">
              <Shield className="w-6 h-6 text-accent-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-2">
                Safety First
              </h3>
              <p className="text-sm text-text-muted mb-4">
                Before buying crypto, make sure you've completed our security
                checklist. Never invest more than you can afford to lose, and
                always store your assets securely.
              </p>
              <a href="/security">
                <Button variant="secondary" className="gap-2">
                  <Shield className="w-4 h-4" />
                  View Security Checklist
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
