import { useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  X, Clock, Monitor, Smartphone, Shield, ArrowRightLeft,
  ArrowUpRight, CheckCircle2, AlertTriangle, Lightbulb,
  ChevronRight, Sparkles, Lock
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

// Parse markdown content into structured sections
function parseContent(content: string) {
  const sections: Array<{
    type: 'hero' | 'section' | 'subsection' | 'steps' | 'tip' | 'warning' | 'table' | 'checklist' | 'paragraph';
    title?: string;
    content: string;
    items?: string[];
  }> = [];

  const lines = content.split('\n');
  let currentSection: typeof sections[0] | null = null;
  let buffer: string[] = [];

  const flushBuffer = () => {
    if (buffer.length > 0 && currentSection) {
      currentSection.content = buffer.join('\n').trim();
      if (currentSection.content) {
        sections.push(currentSection);
      }
    }
    buffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Main title (H1)
    if (trimmed.startsWith('# ')) {
      flushBuffer();
      currentSection = {
        type: 'hero',
        title: trimmed.replace('# ', ''),
        content: ''
      };
      continue;
    }

    // Section (H2)
    if (trimmed.startsWith('## ')) {
      flushBuffer();
      currentSection = {
        type: 'section',
        title: trimmed.replace('## ', ''),
        content: ''
      };
      continue;
    }

    // Subsection (H3)
    if (trimmed.startsWith('### ')) {
      flushBuffer();
      currentSection = {
        type: 'subsection',
        title: trimmed.replace('### ', ''),
        content: ''
      };
      continue;
    }

    // Horizontal rule - section break
    if (trimmed === '---') {
      flushBuffer();
      currentSection = null;
      continue;
    }

    // Blockquote (tip)
    if (trimmed.startsWith('> ')) {
      flushBuffer();
      const quoteContent = trimmed.replace('> ', '');
      const isWarning = quoteContent.toLowerCase().includes('warning') ||
                       quoteContent.toLowerCase().includes('important') ||
                       quoteContent.toLowerCase().includes('critical');
      sections.push({
        type: isWarning ? 'warning' : 'tip',
        content: quoteContent.replace(/^\*\*([^*]+)\*\*:?\s*/, '$1: ')
      });
      currentSection = null;
      continue;
    }

    // Table detection
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (!currentSection || currentSection.type !== 'table') {
        flushBuffer();
        currentSection = {
          type: 'table',
          content: ''
        };
      }
      buffer.push(line);
      continue;
    }

    // Checklist
    if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]')) {
      if (!currentSection || currentSection.type !== 'checklist') {
        flushBuffer();
        currentSection = {
          type: 'checklist',
          content: '',
          items: []
        };
      }
      currentSection.items?.push(trimmed.replace(/^- \[.\] /, ''));
      continue;
    }

    // Numbered list (steps)
    if (/^\d+\.\s/.test(trimmed)) {
      if (!currentSection || currentSection.type !== 'steps') {
        flushBuffer();
        currentSection = {
          type: 'steps',
          content: '',
          items: []
        };
      }
      currentSection.items?.push(trimmed.replace(/^\d+\.\s/, ''));
      continue;
    }

    // Regular content
    if (currentSection) {
      buffer.push(line);
    } else if (trimmed) {
      currentSection = {
        type: 'paragraph',
        content: ''
      };
      buffer.push(line);
    }
  }

  flushBuffer();
  return sections;
}

// Format inline markdown
function formatInline(text: string): React.ReactNode {
  // Handle bold
  let parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    // Handle inline code
    const codeParts = part.split(/(`[^`]+`)/g);
    return codeParts.map((codePart, j) => {
      if (codePart.startsWith('`') && codePart.endsWith('`')) {
        return (
          <code key={`${i}-${j}`} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-mono text-sm">
            {codePart.slice(1, -1)}
          </code>
        );
      }
      return codePart;
    });
  });
}

// Render table
function TableRenderer({ content }: { content: string }) {
  const rows = content.trim().split('\n').filter(row => !row.includes('---'));
  const headers = rows[0]?.split('|').filter(Boolean).map(h => h.trim()) || [];
  const bodyRows = rows.slice(1);

  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-sm font-semibold text-amber-400 bg-amber-500/5 border-b border-amber-500/20 first:rounded-tl-lg last:rounded-tr-lg"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, i) => {
            const cells = row.split('|').filter(Boolean).map(c => c.trim());
            return (
              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                {cells.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-sm text-gray-300">
                    {formatInline(cell)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Step list renderer
function StepsRenderer({ items, startNum = 1 }: { items: string[]; startNum?: number }) {
  return (
    <div className="space-y-4 my-6">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="flex gap-4 group"
        >
          <div className="flex-shrink-0 relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/30 group-hover:border-amber-500/50 transition-colors">
              <span className="text-sm font-bold text-amber-400">{startNum + i}</span>
            </div>
            {i < items.length - 1 && (
              <div className="absolute top-8 left-1/2 w-px h-6 bg-gradient-to-b from-amber-500/30 to-transparent" />
            )}
          </div>
          <div className="flex-1 pt-1">
            <p className="text-gray-300 leading-relaxed">{formatInline(item)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Checklist renderer
function ChecklistRenderer({ items }: { items: string[] }) {
  return (
    <div className="space-y-3 my-6 p-5 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Checklist</span>
      </div>
      {items.map((item, i) => (
        <motion.label
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.03 }}
          className="flex items-start gap-3 cursor-pointer group"
        >
          <div className="mt-0.5 w-5 h-5 rounded border-2 border-emerald-500/40 group-hover:border-emerald-500/60 transition-colors flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-50 transition-opacity" />
          </div>
          <span className="text-gray-300 text-sm leading-relaxed">{formatInline(item)}</span>
        </motion.label>
      ))}
    </div>
  );
}

// Tip/Warning box
function CalloutBox({ type, content }: { type: 'tip' | 'warning'; content: string }) {
  const isTip = type === 'tip';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`my-6 p-5 rounded-xl border ${
        isTip
          ? 'bg-gradient-to-br from-cyan-500/5 to-transparent border-cyan-500/20'
          : 'bg-gradient-to-br from-red-500/5 to-transparent border-red-500/20'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 p-2 rounded-lg ${isTip ? 'bg-cyan-500/10' : 'bg-red-500/10'}`}>
          {isTip ? (
            <Lightbulb className="w-4 h-4 text-cyan-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
        </div>
        <div>
          <span className={`text-xs font-semibold uppercase tracking-wider ${isTip ? 'text-cyan-400' : 'text-red-400'}`}>
            {isTip ? 'Pro Tip' : 'Important'}
          </span>
          <p className="mt-1 text-gray-300 text-sm leading-relaxed">{formatInline(content)}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Section renderer
function SectionRenderer({ section, index }: { section: ReturnType<typeof parseContent>[0]; index: number }) {
  switch (section.type) {
    case 'hero':
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            {section.title}
          </h1>
          {section.content && (
            <p className="mt-4 text-lg text-gray-400 leading-relaxed">{formatInline(section.content)}</p>
          )}
        </motion.div>
      );

    case 'section':
      // Check if title starts with "Step" for special formatting
      const isStep = section.title?.toLowerCase().startsWith('step ');
      const stepMatch = section.title?.match(/^Step (\d+):?\s*(.*)$/i);

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mt-12 mb-6"
        >
          {isStep && stepMatch ? (
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <span className="text-xl font-bold text-black">{stepMatch[1]}</span>
                </div>
              </div>
              <div className="pt-2">
                <h2 className="text-xl md:text-2xl font-bold text-white">{stepMatch[2]}</h2>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-amber-500 to-amber-600" />
              <h2 className="text-xl md:text-2xl font-bold text-white">{section.title}</h2>
            </div>
          )}
          {section.content && (
            <div className="text-gray-300 leading-relaxed whitespace-pre-line pl-0 md:pl-16">
              {section.content.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <br key={i} />;
                if (trimmed.startsWith('- ')) {
                  return (
                    <div key={i} className="flex items-start gap-2 my-1">
                      <ChevronRight className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                      <span>{formatInline(trimmed.slice(2))}</span>
                    </div>
                  );
                }
                return <p key={i} className="my-2">{formatInline(trimmed)}</p>;
              })}
            </div>
          )}
        </motion.div>
      );

    case 'subsection':
      return (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 mb-4"
        >
          <h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            {section.title}
          </h3>
          {section.content && (
            <div className="text-gray-300 leading-relaxed pl-6 border-l-2 border-amber-500/20">
              {section.content.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <br key={i} />;
                if (trimmed.startsWith('- ')) {
                  return (
                    <div key={i} className="flex items-start gap-2 my-1">
                      <span className="text-amber-500">-</span>
                      <span>{formatInline(trimmed.slice(2))}</span>
                    </div>
                  );
                }
                return <p key={i} className="my-2">{formatInline(trimmed)}</p>;
              })}
            </div>
          )}
        </motion.div>
      );

    case 'steps':
      return <StepsRenderer items={section.items || []} />;

    case 'checklist':
      return <ChecklistRenderer items={section.items || []} />;

    case 'table':
      return <TableRenderer content={section.content} />;

    case 'tip':
      return <CalloutBox type="tip" content={section.content} />;

    case 'warning':
      return <CalloutBox type="warning" content={section.content} />;

    case 'paragraph':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="my-4"
        >
          {section.content.split('\n').map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return null;
            if (trimmed.startsWith('- ')) {
              return (
                <div key={i} className="flex items-start gap-2 my-1 text-gray-300">
                  <ChevronRight className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                  <span>{formatInline(trimmed.slice(2))}</span>
                </div>
              );
            }
            return <p key={i} className="text-gray-300 leading-relaxed my-2">{formatInline(trimmed)}</p>;
          })}
        </motion.div>
      );

    default:
      return null;
  }
}

// Progress indicator
function ProgressIndicator({ scrollProgress }: { scrollProgress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500"
        style={{
          width: `${scrollProgress * 100}%`,
          boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)'
        }}
      />
    </div>
  );
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
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!tutorial) return null;

  const Icon = getTutorialIcon(tutorial.category);
  const metadata = tutorial.metadata;
  const sections = parseContent(tutorial.content);

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

            {/* Main content */}
            <div className="py-8">
              {sections.map((section, index) => (
                <SectionRenderer key={index} section={section} index={index} />
              ))}
            </div>

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
