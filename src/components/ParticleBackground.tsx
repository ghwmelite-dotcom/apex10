import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

interface ParticleBackgroundProps {
  variant?: "default" | "calm" | "energetic";
  className?: string;
}

export function ParticleBackground({
  variant = "default",
  className,
}: ParticleBackgroundProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(() => {
    const baseConfig: ISourceOptions = {
      fullScreen: false,
      fpsLimit: 60,
      particles: {
        number: {
          value: variant === "energetic" ? 80 : variant === "calm" ? 30 : 50,
          density: {
            enable: true,
            width: 1920,
            height: 1080,
          },
        },
        color: {
          value: ["#00FFD1", "#00D4FF", "#8B5CF6", "#EC4899"],
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: { min: 0.1, max: 0.4 },
          animation: {
            enable: true,
            speed: 0.5,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            enable: true,
            speed: 2,
            sync: false,
          },
        },
        move: {
          enable: true,
          speed: variant === "energetic" ? 2 : variant === "calm" ? 0.5 : 1,
          direction: "none",
          random: true,
          straight: false,
          outModes: {
            default: "out",
          },
          attract: {
            enable: true,
            rotate: {
              x: 600,
              y: 1200,
            },
          },
        },
        links: {
          enable: true,
          distance: 150,
          color: "#00FFD1",
          opacity: 0.1,
          width: 1,
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
          onClick: {
            enable: true,
            mode: "push",
          },
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 0.3,
              color: "#00FFD1",
            },
          },
          push: {
            quantity: 4,
          },
        },
      },
      detectRetina: true,
      background: {
        color: "transparent",
      },
    };

    return baseConfig;
  }, [variant]);

  if (!init) {
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      className={className}
      options={options}
    />
  );
}

// Floating orbs for hero sections
// Uses CSS containment and will-change to prevent layout shifts
// Deferred render to prevent CLS
export function FloatingOrbs() {
  const [isReady, setIsReady] = useState(false);

  // Defer orb rendering until after initial paint to prevent CLS
  useEffect(() => {
    // Wait for fonts to load and initial paint to complete
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsReady(true);
      });
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  // Don't render anything during initial paint
  if (!isReady) {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ contain: "strict" }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        // Isolate this container from layout calculations
        contain: "strict",
        // Ensure it doesn't affect parent layout
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {/* Large cyan orb - fixed position with transform animation only */}
      <div
        className="absolute rounded-full"
        style={{
          width: "384px",
          height: "384px",
          background: "radial-gradient(circle, rgba(0, 255, 209, 0.15) 0%, transparent 70%)",
          top: "10%",
          left: "10%",
          filter: "blur(40px)",
          willChange: "transform",
          animation: "float 8s ease-in-out infinite",
          // Use transform for initial position to avoid layout
          transform: "translateZ(0)",
        }}
      />

      {/* Purple orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: "320px",
          height: "320px",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
          top: "30%",
          right: "5%",
          filter: "blur(40px)",
          willChange: "transform",
          animation: "float 6s ease-in-out infinite -2s",
          transform: "translateZ(0)",
        }}
      />

      {/* Pink orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: "256px",
          height: "256px",
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)",
          bottom: "20%",
          left: "30%",
          filter: "blur(40px)",
          willChange: "transform",
          animation: "float 8s ease-in-out infinite -4s",
          transform: "translateZ(0)",
        }}
      />

      {/* Blue orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: "288px",
          height: "288px",
          background: "radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)",
          bottom: "10%",
          right: "20%",
          filter: "blur(40px)",
          willChange: "transform",
          animation: "float 6s ease-in-out infinite -1s",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}
