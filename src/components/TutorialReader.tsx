import { useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  X, Clock, Monitor, Smartphone, Shield, ArrowRightLeft,
  ArrowUpRight, Sparkles, Lock
} from "lucide-react";
import { Badge } from "@/components/ui";

interface TutorialMetadata {
  platform?: string;
  difficulty?: string;
  timeRequired?: string;
  requirements?: string[];
}

interface Tutorial {
  id: number;
  type: string;
  category: string;
  title: string;
  content: string;
  severity: string;
  order: number;
  metadata?: TutorialMetadata;
}

// Get icon for tutorial category
function getTutorialIcon(category: string) {
  switch (category) {
    case "binance_desktop":
      return Monitor;
    case "binance_mobile":
      return Smartphone;
    case "binance_security":
      return Lock;
    case "binance_trading":
      return ArrowRightLeft;
    case "binance_withdraw":
      return ArrowUpRight;
    default:
      return Shield;
  }
}

// Main Tutorial Reader Component
export function TutorialReader({
  tutorial,
  onClose
}: {
  tutorial: Tutorial | null;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    if (!tutorial) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [tutorial, onClose]);

  if (!tutorial) return null;

  const Icon = getTutorialIcon(tutorial.category);
  const metadata = tutorial.metadata;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#030712]"
      >
        {/* Progress bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 origin-left z-50"
          style={{ scaleX: scrollProgress }}
        />

        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-40 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20">
                  <Icon className="w-5 h-5 text-amber-500" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-sm font-semibold text-white truncate max-w-[300px]">
                    {tutorial.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    {metadata?.difficulty && (
                      <Badge
                        variant={metadata.difficulty === 'beginner' ? 'success' : metadata.difficulty === 'intermediate' ? 'warning' : 'error'}
                        className="text-[10px] px-2 py-0"
                      >
                        {metadata.difficulty}
                      </Badge>
                    )}
                    {metadata?.timeRequired && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {metadata.timeRequired}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <div
          ref={containerRef}
          className="h-screen overflow-y-auto pt-20 pb-20"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero section with metadata */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="py-8 border-b border-white/5"
            >
              {/* Platform badges */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {metadata?.platform && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    {metadata.platform === 'desktop' ? (
                      <Monitor className="w-4 h-4 text-amber-500" />
                    ) : metadata.platform === 'mobile' ? (
                      <Smartphone className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Shield className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="text-sm text-amber-400">
                      {metadata.platform === 'desktop' ? 'Desktop Guide' :
                       metadata.platform === 'mobile' ? 'Mobile Guide' : 'All Platforms'}
                    </span>
                  </div>
                )}
                {metadata?.timeRequired && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{metadata.timeRequired}</span>
                  </div>
                )}
              </div>

              {/* Requirements */}
              {metadata?.requirements && metadata.requirements.length > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    What you'll need
                  </span>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {metadata.requirements.map((req, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className="px-3 py-1 rounded-lg bg-white/5 text-sm text-gray-300 border border-white/5"
                      >
                        {req}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Main content with ReactMarkdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="py-8"
            >
              <article className="tutorial-content">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-white mt-12 mb-6">
                        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-amber-500 to-amber-600" />
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold text-amber-400 mt-8 mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-base font-semibold text-white mt-6 mb-3">
                        {children}
                      </h4>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-300 leading-relaxed mb-4">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="space-y-2 mb-6 ml-4">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="space-y-3 mb-6 ml-4 list-none counter-reset-item">
                        {children}
                      </ol>
                    ),
                    li: ({ children, ordered }) => (
                      <li className={`text-gray-300 leading-relaxed flex items-start gap-3 ${ordered ? '' : ''}`}>
                        <span className="text-amber-500 mt-1">•</span>
                        <span>{children}</span>
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-white font-semibold">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="text-amber-400 not-italic">{children}</em>
                    ),
                    code: ({ children }) => (
                      <code className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-mono text-sm">
                        {children}
                      </code>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="my-6 p-5 rounded-xl bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20">
                        <div className="text-cyan-400 text-sm">
                          {children}
                        </div>
                      </blockquote>
                    ),
                    hr: () => (
                      <hr className="my-10 border-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-6">
                        <table className="w-full border-collapse">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-amber-500/5">{children}</thead>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-3 text-left text-sm font-semibold text-amber-400 border-b border-amber-500/20">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-3 text-sm text-gray-300 border-b border-white/5">
                        {children}
                      </td>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {tutorial.content}
                </ReactMarkdown>
              </article>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="py-12 border-t border-white/5 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-amber-400">You've completed this guide!</span>
              </div>
              <p className="mt-4 text-gray-500 text-sm">
                Ready to apply what you've learned? Start your crypto journey today.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default TutorialReader;
