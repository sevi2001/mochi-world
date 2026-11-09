
"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import {
  defaultCustomization,
  type MochiCustomization,
} from "@/types/mochi";

export type MochiAction =
  | "idle"
  | "wave"
  | "jump"
  | "dance"
  | "sleep"
  | "love";

type MochiProps = {
  action?: MochiAction;
  onPet?: () => void;
  customization?: MochiCustomization;
};

export default function MochiCharacter({
  action = "idle",
  onPet,
  customization = defaultCustomization,
}: MochiProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  const [eyes, setEyes] = useState({ x: 0, y: 0 });
  const [petCount, setPetCount] = useState(0);
  const [petting, setPetting] = useState(false);

  const petTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const reduceMotion = useReducedMotion();

  const sleeping = action === "sleep";
  const dancing = action === "dance";
  const waving = action === "wave";
  const jumping = action === "jump";
  const loving = action === "love";

  // Eyes follow the mouse
  useEffect(() => {
    if (sleeping || reduceMotion) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = sceneRef.current?.getBoundingClientRect();

      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = Math.max(
        -5,
        Math.min(5, (event.clientX - centerX) / 45)
      );

      const y = Math.max(
        -4,
        Math.min(4, (event.clientY - centerY) / 55)
      );

      setEyes({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [sleeping, reduceMotion]);

  // Clear timers when component unmounts
  useEffect(() => {
    return () => {
      if (petTimer.current) {
        clearTimeout(petTimer.current);
      }
    };
  }, []);

  const handlePet = () => {
    if (sleeping) return;

    setPetCount((count) => count + 1);
    setPetting(true);

    onPet?.();

    if (petTimer.current) {
      clearTimeout(petTimer.current);
    }

    petTimer.current = setTimeout(() => {
      setPetting(false);
    }, 700);
  };

  // Character animations
  const bodyAnimation = reduceMotion
    ? {}
    : sleeping
      ? {
          y: [0, 3, 0],
          scaleY: [1, 0.97, 1],
        }
      : dancing
        ? {
            y: [0, -25, 0, -12, 0],
            rotate: [0, -13, 13, -13, 0],
            scale: [1, 1.07, 1, 1.05, 1],
          }
        : jumping
          ? {
              y: [0, -80, 0],
              scaleY: [1, 1.08, 0.9, 1],
            }
          : waving
            ? {
                y: [0, -10, 0],
                rotate: [0, -5, 5, 0],
              }
            : loving
              ? {
                  y: [0, -12, 0],
                  scale: [1, 1.1, 1],
                  rotate: [0, -4, 4, 0],
                }
              : {
                  y: [0, -15, 0],
                  rotate: [0, 2, -2, 0],
                };

  const duration = jumping
    ? 0.75
    : dancing
      ? 1.4
      : loving
        ? 1.8
        : sleeping
          ? 3
          : 3.5;

  return (
    <div
      ref={sceneRef}
      className="mochi-scene"
    >
      {/* Magical glowing aura */}
      <div
        className="mochi-aura"
        aria-hidden="true"
      />

      {/* Hearts when Mochi is petted */}
      <AnimatePresence>
        {petCount > 0 && (
          <motion.div
            key={petCount}
            className="mochi-heart"
            initial={{
              opacity: 0,
              y: 0,
              scale: 0,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: -130,
              scale: [0, 1.3, 1.5],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 1.2,
            }}
          >
            💗
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating hearts in Love mode */}
      {loving && (
        <motion.div
          className="mochi-love-effect"
          aria-hidden="true"
          animate={
            reduceMotion
              ? {}
              : {
                  y: [0, -35, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6],
                }
          }
          transition={{
            duration: 1.5,
            repeat: reduceMotion ? 0 : Infinity,
          }}
        >
          💕 💖 💕
        </motion.div>
      )}

      {/* Sleeping Zzz */}
      <AnimatePresence>
        {sleeping && (
          <motion.div
            className="sleep-symbols"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={
              reduceMotion
                ? { opacity: 1, y: 0 }
                : {
                    opacity: [0.3, 1, 0.3],
                    y: [0, -30, -60],
                  }
            }
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.5,
              repeat: reduceMotion ? 0 : Infinity,
            }}
          >
            Zzz
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main interactive Mochi */}
      <motion.button
        type="button"
        aria-label={
          sleeping ? "Mochi is sleeping" : "Pet Mochi"
        }
        disabled={sleeping}
        className={`mochi-character mochi-color-${customization.color}`}
        onClick={handlePet}
        animate={bodyAnimation}
        transition={{
          duration,
          repeat: reduceMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
        whileHover={
          sleeping || reduceMotion
            ? {}
            : { scale: 1.07 }
        }
        whileTap={
          sleeping || reduceMotion
            ? {}
            : { scale: 0.92 }
        }
      >
        {/* Star antennae */}
        {customization.accessory === "star" && (
          <>
            <span className="mochi-antenna antenna-left">
              ⭐
            </span>

            <span className="mochi-antenna antenna-right">
              ⭐
            </span>
          </>
        )}

        {/* Bow accessory */}
        {customization.accessory === "bow" && (
          <span className="mochi-accessory accessory-bow">
            🎀
          </span>
        )}

        {/* Crown accessory */}
        {customization.accessory === "crown" && (
          <span className="mochi-accessory accessory-crown">
            👑
          </span>
        )}

        {/* Flower accessory */}
        {customization.accessory === "flower" && (
          <span className="mochi-accessory accessory-flower">
            🌸
          </span>
        )}

        {/* Leaf ears */}
        <span className="mochi-ear ear-left" />
        <span className="mochi-ear ear-right" />

        {/* Customizable wings */}
        {customization.wings !== "none" && (
          <>
            <span
              className={`mochi-wing wing-left ${
                customization.wings === "butterfly"
                  ? "butterfly-wing"
                  : ""
              }`}
            />

            <span
              className={`mochi-wing wing-right ${
                customization.wings === "butterfly"
                  ? "butterfly-wing"
                  : ""
              }`}
            />
          </>
        )}

        {/* Left arm */}
        <motion.span
          className="mochi-arm arm-left"
          animate={
            reduceMotion
              ? {}
              : waving || dancing
                ? {
                    rotate: [-30, -80, -30],
                  }
                : loving
                  ? {
                      rotate: [-20, -55, -20],
                    }
                  : {
                      rotate: [-15, -25, -15],
                    }
          }
          transition={{
            duration: waving ? 0.45 : 1.4,
            repeat: reduceMotion ? 0 : Infinity,
          }}
        />

        {/* Right arm */}
        <motion.span
          className="mochi-arm arm-right"
          animate={
            reduceMotion
              ? {}
              : waving || dancing
                ? {
                    rotate: [30, 100, 30],
                  }
                : loving
                  ? {
                      rotate: [20, 55, 20],
                    }
                  : {
                      rotate: [15, 25, 15],
                    }
          }
          transition={{
            duration: waving ? 0.45 : 1.4,
            repeat: reduceMotion ? 0 : Infinity,
          }}
        />

        {/* Mochi body */}
        <span className="mochi-body">
          <span className="mochi-face">
            {/* Left eye */}
            <span
              className={`mochi-eye eye-left ${
                sleeping ? "sleeping-eye" : ""
              }`}
              style={
                sleeping
                  ? undefined
                  : {
                      translate: `${eyes.x}px ${eyes.y}px`,
                    }
              }
            />

            {/* Right eye */}
            <span
              className={`mochi-eye eye-right ${
                sleeping ? "sleeping-eye" : ""
              }`}
              style={
                sleeping
                  ? undefined
                  : {
                      translate: `${eyes.x}px ${eyes.y}px`,
                    }
              }
            />

            {/* Rosy cheeks */}
            <span className="mochi-blush blush-left" />
            <span className="mochi-blush blush-right" />

            {/* Different expressions */}
            <span className="mochi-mouth">
              {sleeping
                ? "﹏"
                : petting || dancing || loving
                  ? "ᴗ"
                  : "ω"}
            </span>
          </span>
        </span>

        {/* Left foot */}
        <motion.span
          className="mochi-foot foot-left"
          animate={
            reduceMotion
              ? {}
              : dancing
                ? {
                    rotate: [-15, 20, -15],
                  }
                : {
                    rotate: 0,
                  }
          }
          transition={{
            duration: 0.5,
            repeat: reduceMotion ? 0 : Infinity,
          }}
        />

        {/* Right foot */}
        <motion.span
          className="mochi-foot foot-right"
          animate={
            reduceMotion
              ? {}
              : dancing
                ? {
                    rotate: [20, -15, 20],
                  }
                : {
                    rotate: 0,
                  }
          }
          transition={{
            duration: 0.5,
            repeat: reduceMotion ? 0 : Infinity,
          }}
        />
      </motion.button>

      {/* Shadow beneath Mochi */}
      <motion.div
        className="mochi-shadow"
        animate={
          reduceMotion
            ? {}
            : {
                scale: sleeping ? 1 : [1, 0.8, 1],
                opacity: sleeping
                  ? 0.5
                  : [0.5, 0.25, 0.5],
              }
        }
        transition={{
          duration: 3,
          repeat: reduceMotion ? 0 : Infinity,
        }}
      />

      {/* Dancing music notes */}
      {dancing && (
        <div
          className="dance-notes"
          aria-hidden="true"
        >
          🎵 ✨ 🎶
        </div>
      )}
    </div>
  );
}
