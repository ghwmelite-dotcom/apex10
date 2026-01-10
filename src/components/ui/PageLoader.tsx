import { motion } from "framer-motion";

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        {/* Spinning loader */}
        <div className="relative w-12 h-12">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-aurora-cyan border-r-aurora-blue"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-1 rounded-full border-2 border-transparent border-b-aurora-purple border-l-aurora-pink"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Loading text */}
        <div className="flex items-center gap-1">
          <span className="text-sm text-text-muted">Loading</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-aurora-cyan"
          >
            ...
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}
