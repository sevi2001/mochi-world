
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Heart,
  Sparkles,
  Cookie,
  CircleDot,
  Hand,
  RotateCcw,
} from "lucide-react";

import MochiCharacter from "@/components/MochiCharacter";
import type { MochiAction } from "@/components/MochiCharacter";

type Activity = "feed" | "ball" | "tickle";

const STORAGE_KEY = "mochi_happiness";

const activities = [
  {
    id: "feed",
    title: "Feed Mochi",
    description: "Give Mochi a yummy snack!",
    icon: Cookie,
    emoji: "🍓",
    color: "feed",
    points: 10,
  },
  {
    id: "ball",
    title: "Play Ball",
    description: "Let's play together!",
    icon: CircleDot,
    emoji: "⚽",
    color: "ball",
    points: 15,
  },
  {
    id: "tickle",
    title: "Tickle",
    description: "Make Mochi giggle!",
    icon: Hand,
    emoji: "💗",
    color: "tickle",
    points: 5,
  },
] as const;

export default function PlayPage() {
  const [happiness, setHappiness] = useState(50);
  const [action, setAction] = useState<MochiAction>("idle");
  const [activity, setActivity] = useState<Activity | null>(null);
  const [effectId, setEffectId] = useState(0);
  const [message, setMessage] = useState(
    "Yay! You're here! Let's play! 💚"
  );
  const [ready, setReady] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const value = Number(saved);
        if (Number.isFinite(value)) {
          setHappiness(Math.min(100, Math.max(0, value)));
        }
      }
    } catch {
      // Storage may be unavailable in private browsing.
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(STORAGE_KEY, String(happiness));
    } catch {
      // The game can still work without storage.
    }
  }, [happiness, ready]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const doActivity = (type: Activity) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const selected = activities.find((item) => item.id === type);
    if (!selected) return;

    setActivity(type);
    setEffectId((prev) => prev + 1);
    setHappiness((prev) => Math.min(100, prev + selected.points));

    if (type === "feed") {
      setAction("love");
      setMessage("Yummyyy! Thank you for the snack! 🍓");
    }

    if (type === "ball") {
      setAction("jump");
      setMessage("Wheeee! Catch the ball! ⚽");
    }

    if (type === "tickle") {
      setAction("dance");
      setMessage("Hehehe! That tickles! 💗");
    }

    timerRef.current = setTimeout(() => {
      setAction("idle");
      setActivity(null);
      setMessage("What should we play next? ✨");
    }, 2400);
  };

  const resetHappiness = () => {
    setHappiness(50);
    setMessage("A fresh start! Let's have fun! 🌸");
  };

  return (
    <main className="play-world">
      <div className="play-background" aria-hidden="true">
        <span className="play-cloud cloud-one">☁️</span>
        <span className="play-cloud cloud-two">☁️</span>
        <span className="play-cloud cloud-three">☁️</span>
        <span className="play-flower flower-one">🌸</span>
        <span className="play-flower flower-two">🌼</span>
        <span className="play-flower flower-three">🌷</span>
        <span className="play-butterfly">🦋</span>
      </div>

      <div className="play-container">
        <header className="play-header">
          <Link href="/" className="play-back">
            <ArrowLeft size={19} />
            Back Home
          </Link>

          <div className="play-brand">
            🌱 Mochi's Magical Playground
          </div>

          <div className="play-header-heart">
            <Heart size={18} fill="currentColor" />
            {happiness}%
          </div>
        </header>

        <motion.div
          className="play-heading"
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="play-tag">
            <Sparkles size={17} />
            Welcome to the Play Room!
          </span>

          <h1>
            Let's Play, <span>Mochi!</span>
          </h1>

          <p>
            Every little moment makes our magical friend happier.
          </p>
        </motion.div>

        <div className="play-layout">
          <motion.section
            className="play-stage"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="play-stage-stars" aria-hidden="true">
              ✨ ⭐ ✨
            </div>

            <motion.div
              className="play-speech"
              key={message}
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
            >
              {message}
            </motion.div>

            <div className="play-character-area">
              <MochiCharacter
                action={action}
                onPet={() => {
                  setHappiness((prev) => Math.min(100, prev + 1));
                }}
              />

              <AnimatePresence mode="wait">
                {activity && (
                  <motion.div
                    key={effectId}
                    className={`play-effect effect-${activity}`}
                    initial={{
                      opacity: 0,
                      y: 80,
                      scale: 0.3,
                      rotate: -30,
                    }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      y: [80, -40, -90],
                      scale: [0.3, 1.3, 1],
                      rotate: [0, 15, -15, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.8 }}
                  >
                    {activities.find((a) => a.id === activity)?.emoji}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="play-ground">
              <span>🌷</span>
              <span>🌼</span>
              <span>🌸</span>
              <span>🌻</span>
              <span>🌷</span>
            </div>
          </motion.section>

          <motion.aside
            className="play-sidebar"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="happiness-card">
              <div className="happiness-top">
                <div>
                  <span className="happiness-label">
                    💗 Mochi's Happiness
                  </span>
                  <h2>{happiness}%</h2>
                </div>

                <span className="happiness-face">
                  {happiness >= 80
                    ? "🥰"
                    : happiness >= 40
                      ? "😊"
                      : "🥺"}
                </span>
              </div>

              <div
                className="happiness-track"
                role="progressbar"
                aria-label="Mochi's happiness"
                aria-valuenow={happiness}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <motion.div
                  className="happiness-fill"
                  animate={{ width: `${happiness}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <p>
                {happiness === 100
                  ? "Mochi is super happy! You're amazing! ✨"
                  : "Play together to fill Mochi's heart!"}
              </p>

              <button
                type="button"
                className="happiness-reset"
                onClick={resetHappiness}
              >
                <RotateCcw size={14} />
                Reset happiness
              </button>
            </div>

            <div className="activities-card">
              <h2>🎮 Fun Activities</h2>
              <p>Choose something fun to do!</p>

              <div className="activity-list">
                {activities.map((item) => {
                  const Icon = item.icon;

                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      className={`activity-item ${item.color}`}
                      onClick={() => doActivity(item.id)}
                      whileHover={{ x: 5, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <span className="activity-icon">
                        <Icon size={23} />
                      </span>

                      <span className="activity-info">
                        <strong>{item.title}</strong>
                        <small>{item.description}</small>
                      </span>

                      <span className="activity-points">
                        +{item.points}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.aside>
        </div>

        <footer className="play-footer">
          Made with 💗 in Mochi World
        </footer>
      </div>
    </main>
  );
}
