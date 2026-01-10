import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true); // Default to true to prevent flash

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Check for touch device on mount
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);

      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      if (target) {
        const isClickable =
          target.tagName === "A" ||
          target.tagName === "BUTTON" ||
          target.closest("a") !== null ||
          target.closest("button") !== null ||
          target.getAttribute("role") === "button" ||
          window.getComputedStyle(target).cursor === "pointer";
        setIsPointer(isClickable);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isTouchDevice, cursorX, cursorY]);

  // Don't render on touch devices
  if (isTouchDevice) {
    return null;
  }

  return (
    <>
      {/* Main cursor ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.8 : isPointer ? 1.5 : 1,
            opacity: isVisible ? 1 : 0,
            borderColor: isPointer ? "#00FFD1" : "rgba(255, 255, 255, 0.8)",
          }}
          transition={{ duration: 0.15 }}
          className="w-8 h-8 rounded-full border-2"
          style={{
            boxShadow: isPointer ? "0 0 20px rgba(0, 255, 209, 0.5)" : "none",
          }}
        />
        {/* Inner dot */}
        <motion.div
          animate={{
            scale: isPointer ? 0 : 1,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"
        />
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            opacity: isVisible ? 0.15 : 0,
            scale: isPointer ? 1.5 : 1,
            backgroundColor: isPointer ? "#00FFD1" : "#8B5CF6",
          }}
          transition={{ duration: 0.3 }}
          className="w-24 h-24 rounded-full blur-xl"
        />
      </motion.div>

      {/* Global cursor hide style */}
      <style>{`
        body {
          cursor: none;
        }
        a, button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"]) {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
