
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Sparkle = {
  id: number;
  x: number;
  y: number;
};

export default function MagicalCursor() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia(
      "(pointer: fine)"
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updateEnabled = () => {
      setEnabled(
        finePointer.matches && !reducedMotion.matches
      );
    };

    updateEnabled();

    finePointer.addEventListener("change", updateEnabled);
    reducedMotion.addEventListener(
      "change",
      updateEnabled
    );

    return () => {
      finePointer.removeEventListener(
        "change",
        updateEnabled
      );
      reducedMotion.removeEventListener(
        "change",
        updateEnabled
      );
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let lastTime = 0;
    let nextId = 0;

    const handleMove = (event: PointerEvent) => {
      const now = performance.now();

      if (now - lastTime < 65) return;
      lastTime = now;

      const sparkle = {
        id: nextId++,
        x: event.clientX,
        y: event.clientY,
      };

      setSparkles((previous) =>
        [...previous.slice(-9), sparkle]
      );
    };

    window.addEventListener("pointermove", handleMove);

    return () => {
      window.removeEventListener(
        "pointermove",
        handleMove
      );
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="magical-cursor" aria-hidden="true">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.span
            key={sparkle.id}
            className="cursor-sparkle"
            style={{
              left: sparkle.x,
              top: sparkle.y,
            }}
            initial={{
              opacity: 1,
              scale: 0.5,
              rotate: 0,
            }}
            animate={{
              opacity: 0,
              scale: 1.6,
              y: -30,
              rotate: 90,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65 }}
            onAnimationComplete={() => {
              setSparkles((previous) =>
                previous.filter(
                  (item) => item.id !== sparkle.id
                )
              );
            }}
          >
            ✦
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
