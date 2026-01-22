/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ============================================
        // SIGNATURE COLOR PALETTE - "Aurora Night"
        // ============================================

        // Primary backgrounds - Deep space gradient base
        bg: {
          primary: "#030712",
          secondary: "#0a0f1a",
          tertiary: "#111827",
          elevated: "#1a2332",
          glass: "rgba(10, 15, 26, 0.8)",
        },

        // Aurora accent colors
        aurora: {
          cyan: "#00FFD1",
          blue: "#00D4FF",
          purple: "#8B5CF6",
          pink: "#EC4899",
          green: "#10B981",
        },

        // Signature gradients via CSS
        accent: {
          primary: "#00FFD1",    // Aurora Cyan - main brand
          secondary: "#8B5CF6",  // Nebula Violet
          tertiary: "#00D4FF",   // Electric Blue
        },

        // Semantic colors
        solar: {
          gold: "#FFD700",
          orange: "#F59E0B",
        },
        quantum: {
          green: "#10B981",
          emerald: "#34D399",
        },
        plasma: {
          orange: "#F59E0B",
          amber: "#FBBF24",
        },
        nova: {
          red: "#EF4444",
          rose: "#F43F5E",
        },

        // Text colors
        text: {
          primary: "#FFFFFF",
          secondary: "#E2E8F0",
          muted: "#94A3B8",
          disabled: "#475569",
        },

        // Border colors
        border: {
          default: "rgba(148, 163, 184, 0.1)",
          hover: "rgba(148, 163, 184, 0.2)",
          focus: "#00FFD1",
          glow: "rgba(0, 255, 209, 0.3)",
        },

        // Crypto-specific
        crypto: {
          bitcoin: "#F7931A",
          ethereum: "#627EEA",
          solana: "#00FFA3",
          positive: "#10B981",
          negative: "#EF4444",
        },

        // XRP Brand Colors
        xrp: {
          navy: "#23292F",      // Primary dark background
          cyan: "#00AAE4",      // Primary accent
          teal: "#00C2C7",      // Secondary accent
          white: "#FFFFFF",
          "navy-dark": "#1a1f25",
          "cyan-glow": "rgba(0, 170, 228, 0.4)",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        display: ["Cal Sans", "Inter", "system-ui", "sans-serif"],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "display-xl": ["4rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },

      boxShadow: {
        // Glow effects
        "glow-sm": "0 0 10px rgba(0, 255, 209, 0.2)",
        "glow": "0 0 20px rgba(0, 255, 209, 0.3)",
        "glow-lg": "0 0 40px rgba(0, 255, 209, 0.4)",
        "glow-purple": "0 0 20px rgba(139, 92, 246, 0.3)",
        "glow-gold": "0 0 20px rgba(255, 215, 0, 0.3)",

        // XRP-specific glows
        "xrp-glow": "0 0 30px rgba(0, 170, 228, 0.4)",
        "xrp-pulse": "0 0 20px rgba(0, 170, 228, 0.6), 0 0 40px rgba(0, 170, 228, 0.3)",
        "xrp-glow-sm": "0 0 15px rgba(0, 170, 228, 0.3)",

        // Elevated surfaces
        "glass": "0 8px 32px rgba(0, 0, 0, 0.3)",
        "card": "0 4px 20px rgba(0, 0, 0, 0.25)",
        "elevated": "0 20px 50px rgba(0, 0, 0, 0.4)",

        // Inner glow
        "inner-glow": "inset 0 0 20px rgba(0, 255, 209, 0.1)",
      },

      backgroundImage: {
        // Gradient meshes
        "mesh-gradient": `
          radial-gradient(at 40% 20%, rgba(0, 255, 209, 0.15) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
          radial-gradient(at 0% 50%, rgba(0, 212, 255, 0.1) 0px, transparent 50%),
          radial-gradient(at 80% 50%, rgba(236, 72, 153, 0.08) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.1) 0px, transparent 50%)
        `,
        "mesh-subtle": `
          radial-gradient(at 0% 0%, rgba(0, 255, 209, 0.08) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.08) 0px, transparent 50%)
        `,

        // Aurora gradients
        "aurora-flow": "linear-gradient(135deg, #00FFD1 0%, #00D4FF 25%, #8B5CF6 50%, #EC4899 75%, #00FFD1 100%)",
        "aurora-subtle": "linear-gradient(135deg, rgba(0, 255, 209, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",

        // Card gradients
        "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",

        // Rank gradients
        "rank-gold": "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
        "rank-silver": "linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)",
        "rank-bronze": "linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)",

        // XRP gradients
        "xrp-gradient": "linear-gradient(135deg, #00AAE4 0%, #00C2C7 100%)",
        "xrp-hero": "linear-gradient(180deg, #23292F 0%, #1a1f25 100%)",
        "xrp-mesh": `
          radial-gradient(at 20% 30%, rgba(0, 170, 228, 0.15) 0px, transparent 50%),
          radial-gradient(at 80% 20%, rgba(0, 194, 199, 0.1) 0px, transparent 50%),
          radial-gradient(at 50% 80%, rgba(0, 170, 228, 0.08) 0px, transparent 50%)
        `,
      },

      animation: {
        // Ambient animations
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",

        // Entry animations
        "fade-in": "fade-in 0.5s ease-out",
        "fade-up": "fade-up 0.5s ease-out",
        "fade-down": "fade-down 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        "slide-in-left": "slide-in-left 0.4s ease-out",

        // Interactive
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",

        // Number flip
        "flip-up": "flip-up 0.4s ease-out",
        "flip-down": "flip-down 0.4s ease-out",

        // Aurora effect
        "aurora": "aurora 15s ease-in-out infinite",

        // Heartbeat
        "heartbeat": "heartbeat 1s ease-in-out infinite",

        // XRP animations
        "xrp-pulse": "xrp-pulse 2s ease-in-out infinite",
        "xrp-ring": "xrp-ring 3s ease-in-out infinite",
        "signal-pulse": "signal-pulse 1.5s ease-in-out infinite",
      },

      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 255, 209, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 255, 209, 0.4)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "flip-up": {
          "0%": { transform: "rotateX(90deg)", opacity: "0" },
          "100%": { transform: "rotateX(0deg)", opacity: "1" },
        },
        "flip-down": {
          "0%": { transform: "rotateX(-90deg)", opacity: "0" },
          "100%": { transform: "rotateX(0deg)", opacity: "1" },
        },
        "aurora": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "heartbeat": {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.1)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.1)" },
          "70%": { transform: "scale(1)" },
        },
        "xrp-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 170, 228, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 170, 228, 0.6)" },
        },
        "xrp-ring": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "signal-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
      },

      backdropBlur: {
        xs: "2px",
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
