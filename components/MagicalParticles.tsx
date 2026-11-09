
"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const particles = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 41 + 13) % 100}%`,
  top: `${(i * 29 + 7) % 100}%`,
  size: 10 + (i % 4) * 5,
  delay: (i % 8) * 0.4,
  duration: 3 + (i % 5),
  symbol: ["✦", "✧", "✿", "♡"][i % 4],
}));

export default function MagicalParticles() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleVisibility = () => {
      setVisible(!document.hidden);
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, []);

  return (
    <div className="magical-particles" aria-hidden="true">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="magical-particle"
          style={{
            left: particle.left,
            top: particle.top,
            fontSize: particle.size,
          }}
          animate={
            reduceMotion || !visible
              ? { opacity: 0.45 }
              : {
                  y: [0, -35, 0],
                  x: [0, 12, -12, 0],
                  opacity: [0.2, 0.9, 0.2],
                  rotate: [0, 20, -20, 0],
                }
          }
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: reduceMotion ? 0 : Infinity,
            ease: "easeInOut",
          }}
        >
          {particle.symbol}
        </motion.span>
      ))}
    </div>
  );
}
