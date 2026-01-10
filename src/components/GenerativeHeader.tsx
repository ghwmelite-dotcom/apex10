import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GenerativeHeaderProps {
  symbol: string;
  name: string;
  className?: string;
}

// Color palettes for each crypto
const CRYPTO_PALETTES: Record<string, { primary: string; secondary: string; accent: string }> = {
  BTC: { primary: "#F7931A", secondary: "#FFB84D", accent: "#CC7700" },
  ETH: { primary: "#627EEA", secondary: "#8B9FEF", accent: "#3D5BD9" },
  SOL: { primary: "#00FFA3", secondary: "#14F195", accent: "#00CC82" },
  AVAX: { primary: "#E84142", secondary: "#FF6B6B", accent: "#C73030" },
  LINK: { primary: "#375BD2", secondary: "#5A7CE8", accent: "#2A47A8" },
  AAVE: { primary: "#B6509E", secondary: "#D472BE", accent: "#943D80" },
  UNI: { primary: "#FF007A", secondary: "#FF4D9E", accent: "#CC0062" },
  ARB: { primary: "#28A0F0", secondary: "#5CBAF5", accent: "#1A80C4" },
  OP: { primary: "#FF0420", secondary: "#FF4D5E", accent: "#CC0019" },
  MATIC: { primary: "#8247E5", secondary: "#A06FEF", accent: "#6930C3" },
};

// Pattern types for variety
type PatternType = "fractal" | "waves" | "grid" | "circles" | "hexagons";

const SYMBOL_PATTERNS: Record<string, PatternType> = {
  BTC: "fractal",
  ETH: "hexagons",
  SOL: "waves",
  AVAX: "grid",
  LINK: "circles",
  AAVE: "waves",
  UNI: "circles",
  ARB: "hexagons",
  OP: "grid",
  MATIC: "hexagons",
};

export function GenerativeHeader({ symbol, name, className }: GenerativeHeaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const palette = CRYPTO_PALETTES[symbol] || { primary: "#00FFD1", secondary: "#8B5CF6", accent: "#00D4FF" };
  const patternType = SYMBOL_PATTERNS[symbol] || "waves";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#030712");
    gradient.addColorStop(0.5, "#0a0f1a");
    gradient.addColorStop(1, "#030712");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw pattern based on type
    drawPattern(ctx, patternType, palette, rect.width, rect.height);

    // Draw symbol watermark
    ctx.save();
    ctx.globalAlpha = 0.03;
    ctx.font = `bold ${rect.height * 0.8}px Inter, system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = palette.primary;
    ctx.fillText(symbol, rect.width / 2, rect.height / 2);
    ctx.restore();

  }, [symbol, palette, patternType]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={cn("relative w-full h-64 overflow-hidden rounded-2xl", className)}
    >
      {/* Canvas for generative art */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />

      {/* Animated accent glow */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(ellipse at 20% 50%, ${palette.primary}20 0%, transparent 50%)`,
            `radial-gradient(ellipse at 80% 50%, ${palette.secondary}20 0%, transparent 50%)`,
            `radial-gradient(ellipse at 50% 80%, ${palette.accent}20 0%, transparent 50%)`,
            `radial-gradient(ellipse at 20% 50%, ${palette.primary}20 0%, transparent 50%)`,
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {/* Symbol badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
          style={{
            background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
            boxShadow: `0 0 40px ${palette.primary}40`,
          }}
        >
          <span className="text-2xl font-bold text-white">{symbol.charAt(0)}</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-text-primary mb-2"
        >
          {name}
        </motion.h1>

        {/* Symbol */}
        <motion.span
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg font-medium"
          style={{ color: palette.primary }}
        >
          {symbol}
        </motion.span>
      </div>
    </motion.div>
  );
}

// Pattern drawing functions
function drawPattern(
  ctx: CanvasRenderingContext2D,
  type: PatternType,
  palette: { primary: string; secondary: string; accent: string },
  width: number,
  height: number
) {
  ctx.save();
  ctx.globalAlpha = 0.15;

  switch (type) {
    case "fractal":
      drawFractalPattern(ctx, palette, width, height);
      break;
    case "waves":
      drawWavePattern(ctx, palette, width, height);
      break;
    case "grid":
      drawGridPattern(ctx, palette, width, height);
      break;
    case "circles":
      drawCirclePattern(ctx, palette, width, height);
      break;
    case "hexagons":
      drawHexagonPattern(ctx, palette, width, height);
      break;
  }

  ctx.restore();
}

function drawFractalPattern(
  ctx: CanvasRenderingContext2D,
  palette: { primary: string; secondary: string },
  width: number,
  height: number
) {
  const iterations = 50;
  ctx.strokeStyle = palette.primary;
  ctx.lineWidth = 0.5;

  for (let i = 0; i < iterations; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 100 + 20;
    const angle = Math.random() * Math.PI * 2;

    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let j = 0; j < 6; j++) {
      const nx = x + Math.cos(angle + (j * Math.PI) / 3) * size;
      const ny = y + Math.sin(angle + (j * Math.PI) / 3) * size;
      ctx.lineTo(nx, ny);
    }
    ctx.closePath();
    ctx.stroke();
  }
}

function drawWavePattern(
  ctx: CanvasRenderingContext2D,
  palette: { primary: string; secondary: string },
  width: number,
  height: number
) {
  const waves = 5;
  const amplitude = 30;

  for (let w = 0; w < waves; w++) {
    ctx.beginPath();
    ctx.strokeStyle = w % 2 === 0 ? palette.primary : palette.secondary;
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x += 2) {
      const y = height / 2 + Math.sin((x / 50) + (w * 0.5)) * amplitude * (1 + w * 0.3);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function drawGridPattern(
  ctx: CanvasRenderingContext2D,
  palette: { primary: string },
  width: number,
  height: number
) {
  const gridSize = 40;
  ctx.strokeStyle = palette.primary;
  ctx.lineWidth = 0.5;

  // Vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Dots at intersections
  ctx.fillStyle = palette.primary;
  for (let x = 0; x <= width; x += gridSize) {
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawCirclePattern(
  ctx: CanvasRenderingContext2D,
  palette: { primary: string; secondary: string },
  width: number,
  height: number
) {
  const circles = 20;

  for (let i = 0; i < circles; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 80 + 20;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.secondary;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawHexagonPattern(
  ctx: CanvasRenderingContext2D,
  palette: { primary: string },
  width: number,
  height: number
) {
  const size = 30;
  const h = size * Math.sqrt(3);
  ctx.strokeStyle = palette.primary;
  ctx.lineWidth = 0.5;

  for (let row = -1; row < height / h + 1; row++) {
    for (let col = -1; col < width / (size * 1.5) + 1; col++) {
      const x = col * size * 1.5;
      const y = row * h + (col % 2 === 0 ? 0 : h / 2);

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + size * Math.cos(angle);
        const hy = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
}
