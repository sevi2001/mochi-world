
"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

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
};

export default function MochiCharacter({
  action = "idle",
  onPet,
}: MochiProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [eyes, setEyes] = useState({ x: 0, y: 0 });
  const [petCount, setPetCount] = useState(0);
  const [petting, setPetting] = useState(false);
  const petTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reduceMotion = useReducedMotion();
  const sleeping = action === "sleep";
  const dancing = action === "dance";
  const waving = action === "wave";

  useEffect(() => {
    if (sleeping) return;

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
  }, [sleeping]);

  useEffect(() => {
    return () => {
      if (petTimer.current) clearTimeout(petTimer.current);
    };
  }, []);

  const handlePet = () => {
    if (sleeping) return;

    setPetCount((count) => count + 1);
    setPetting(true);
    onPet?.();

    if (petTimer.current) clearTimeout(petTimer.current);

    petTimer.current = setTimeout(() => {
      setPetting(false);
    }, 700);
  };

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
        : action === "jump"
          ? {
              y: [0, -80, 0],
              scaleY: [1, 1.08, 0.9, 1],
            }
          : waving
            ? {
                y: [0, -10, 0],
                rotate: [0, -5, 5, 0],
              }
            : {
                y: [0, -15, 0],
                rotate: [0, 2, -2, 0],
              };

  const duration =
    action === "jump" ? 0.75 :
    dancing ? 1.4 :
    sleeping ? 3 :
    3.5;

  return (
    <div ref={sceneRef} className="mochi-scene">
      <div className="mochi-aura" aria-hidden="true" />

      <AnimatePresence>
        {petCount > 0 && (
          <motion.div
            key={petCount}
            className="mochi-heart"
            initial={{ opacity: 0, y: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: -130,
              scale: [0, 1.3, 1.5],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            💗
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sleeping && (
          <motion.div
            className="sleep-symbols"
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: [0.3, 1, 0.3],
              y: [0, -30, -60],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
            }}
          >
            Zzz
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={sleeping ? "Mochi is sleeping" : "Pet Mochi"}
        disabled={sleeping}
        className="mochi-character"
        onClick={handlePet}
        animate={bodyAnimation}
        transition={{
          duration,
          repeat: reduceMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
        whileHover={sleeping ? {} : { scale: 1.07 }}
        whileTap={sleeping ? {} : { scale: 0.92 }}
      >
        <span className="mochi-antenna antenna-left">⭐</span>
        <span className="mochi-antenna antenna-right">⭐</span>

        <span className="mochi-ear ear-left" />
        <span className="mochi-ear ear-right" />

        <span className="mochi-wing wing-left" />
        <span className="mochi-wing wing-right" />

        <motion.span
          className="mochi-arm arm-left"
          animate={
            waving || dancing
              ? { rotate: [-30, -80, -30] }
              : { rotate: [-15, -25, -15] }
          }
          transition={{
            duration: waving ? 0.45 : 1.4,
            repeat: reduceMotion ? 0 : Infinity,
          }}
        />

        <motion.span
          className="mochi-arm arm-right"
          animate={
            waving || dancing
              ? { rotate: [30, 100, 30] }
              : { rotate: [15, 25, 15] }
          }
          transition={{
            duration: waving ? 0.45 : 1.4,
            repeat: reduceMotion ? 0 : Infinity,
          }}
        />

        <span className="mochi-body">
          <span className="mochi-face">
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

            <span className="mochi-blush blush-left" />
            <span className="mochi-blush blush-right" />

            <span className="mochi-mouth">
              {sleeping ? "﹏" : petting || dancing ? "ᴗ" : "ω"}
            </span>
          </span>
        </span>

        <motion.span
          className="mochi-foot foot-left"
          animate={
            dancing
              ? { rotate: [-15, 20, -15] }
              : { rotate: 0 }
          }
          transition={{
            duration: 0.5,
            repeat: reduceMotion ? 0 : Infinity,
          }}
        />

        <motion.span
          className="mochi-foot foot-right"
          animate={
            dancing
              ? { rotate: [20, -15, 20] }
              : { rotate: 0 }
          }
          transition={{
            duration: 0.5,
            repeat: reduceMotion ? 0 : Infinity,
          }}
        />
      </motion.button>

      <motion.div
        className="mochi-shadow"
        animate={
          reduceMotion
            ? {}
            : {
                scale: sleeping ? 1 : [1, 0.8, 1],
                opacity: sleeping ? 0.5 : [0.5, 0.25, 0.5],
              }
        }
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />

      {dancing && (
        <div className="dance-notes" aria-hidden="true">
          🎵 ✨ 🎶
        </div>
      )}
    </div>
  );
}
