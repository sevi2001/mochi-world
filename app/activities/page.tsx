
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Music2,
  Rabbit,
  Heart,
  Star,
  Trophy,
  Sparkles,
  RotateCcw,
  Play,
} from "lucide-react";
import { playSound } from "@/lib/sounds";

import SavedMochi from "@/components/SavedMochi";
import type { MochiAction } from "@/components/MochiCharacter";

type ActivityType = "dance" | "jump" | "love";

type Progress = {
  stars: number;
  completed: number;
  bestCombo: number;
  counts: Record<ActivityType, number>;
};

const STORAGE_KEY = "mochi_activities_progress";

const initialProgress: Progress = {
  stars: 0,
  completed: 0,
  bestCombo: 0,
  counts: {
    dance: 0,
    jump: 0,
    love: 0,
  },
};

const activities = [
  {
    id: "dance",
    title: "Dance Party",
    description: "Dance with Mochi and collect stars!",
    emoji: "🎵",
    reward: 15,
    icon: Music2,
    className: "dance",
    message: "Let's dance together! 🎶",
    duration: 5000,
  },
  {
    id: "jump",
    title: "Jump Challenge",
    description: "Help Mochi bounce into the sky!",
    emoji: "🐰",
    reward: 10,
    icon: Rabbit,
    className: "jump",
    message: "Boing! Look how high I can jump! 🌈",
    duration: 4000,
  },
  {
    id: "love",
    title: "Friendship Magic",
    description: "Fill the garden with magical hearts!",
    emoji: "💗",
    reward: 12,
    icon: Heart,
    className: "love",
    message: "You're my favorite friend! 💕",
    duration: 4500,
  },
] as const;

const achievements = [
  {
    title: "First Adventure",
    emoji: "🌱",
    description: "Complete your first activity",
    unlocked: (p: Progress) => p.completed >= 1,
  },
  {
    title: "Dance Star",
    emoji: "💃",
    description: "Finish 5 dance parties",
    unlocked: (p: Progress) => p.counts.dance >= 5,
  },
  {
    title: "Jump Master",
    emoji: "🐰",
    description: "Finish 5 jumping challenges",
    unlocked: (p: Progress) => p.counts.jump >= 5,
  },
  {
    title: "Best Friends",
    emoji: "💖",
    description: "Finish 5 friendship activities",
    unlocked: (p: Progress) => p.counts.love >= 5,
  },
  {
    title: "Star Collector",
    emoji: "⭐",
    description: "Earn 200 stars",
    unlocked: (p: Progress) => p.stars >= 200,
  },
  {
    title: "Magical Legend",
    emoji: "👑",
    description: "Complete 20 activities",
    unlocked: (p: Progress) => p.completed >= 20,
  },
];

function isProgress(value: unknown): value is Progress {
  if (!value || typeof value !== "object") return false;

  const p = value as Partial<Progress>;

  const validNumber = (n: unknown) =>
    typeof n === "number" &&
    Number.isSafeInteger(n) &&
    n >= 0;

  return (
    validNumber(p.stars) &&
    validNumber(p.completed) &&
    validNumber(p.bestCombo) &&
    p.counts !== null &&
    typeof p.counts === "object" &&
    validNumber(p.counts?.dance) &&
    validNumber(p.counts?.jump) &&
    validNumber(p.counts?.love)
  );
}

export default function ActivitiesPage() {
  const [progress, setProgress] = useState<Progress>(
    initialProgress
  );

  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<ActivityType | null>(
    null
  );

  const [action, setAction] = useState<MochiAction>("idle");
  const [message, setMessage] = useState(
    "Ready for a magical adventure? ✨"
  );

  const [combo, setCombo] = useState(0);
  const [effectKey, setEffectKey] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const busyRef = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (isProgress(parsed)) {
          setProgress(parsed);
        }
      }
    } catch {
      // Start fresh if browser storage is unavailable.
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(progress)
      );
    } catch {
      // The game still works without storage.
    }
  }, [progress, ready]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const startActivity = (type: ActivityType) => {
    if (busyRef.current || !ready) return;

    const selected = activities.find(
      (item) => item.id === type
    );

    if (!selected) return;

    busyRef.current = true;

    setActive(type);
    setAction(type);
    setMessage(selected.message);
    playSound(
  type === "love" ? "magic" : type
);
playSound("reward");
    setEffectKey((previous) => previous + 1);

    timerRef.current = setTimeout(() => {
      setProgress((previous) => ({
        stars: previous.stars + selected.reward,
        completed: previous.completed + 1,
        bestCombo: Math.max(
          previous.bestCombo,
          combo + 1
        ),
        counts: {
          ...previous.counts,
          [type]: previous.counts[type] + 1,
        },
      }));

      setCombo((previous) => previous + 1);
      setActive(null);
      setAction("idle");
      setMessage(
        `Amazing! You earned ${selected.reward} stars! ⭐`
      );

      busyRef.current = false;
      timerRef.current = null;
    }, selected.duration);
  };

  const resetProgress = () => {
    if (busyRef.current) return;

    setProgress({
      stars: 0,
      completed: 0,
      bestCombo: 0,
      counts: {
        dance: 0,
        jump: 0,
        love: 0,
      },
    });

    setCombo(0);
    setMessage("A brand-new magical adventure! 🌸");
  };

  const unlockedCount = achievements.filter(
    (achievement) => achievement.unlocked(progress)
  ).length;

  return (
    <main className="activities-world">
      <div
        className="activities-decorations"
        aria-hidden="true"
      >
        <span>🌸</span>
        <span>✨</span>
        <span>🦋</span>
        <span>🌼</span>
        <span>⭐</span>
        <span>💗</span>
      </div>

      <div className="activities-container">
        <header className="activities-header">
          <Link href="/" className="activities-back">
            <ArrowLeft size={18} />
            Back Home
          </Link>

          <strong>🌸 Mochi's Activity Garden</strong>

          <div className="activities-stars">
            <Star size={18} fill="currentColor" />
            {progress.stars} Stars
          </div>
        </header>

        <motion.section
          className="activities-heading"
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="activities-tag">
            <Sparkles size={17} />
            Let's Make Magical Memories!
          </div>

          <h1>
            Fun with <span>Mochi!</span>
          </h1>

          <p>
            Dance, jump, and spread friendship magic
            to earn sparkling rewards!
          </p>
        </motion.section>

        <div className="activities-layout">
          <motion.section
            className="activities-stage"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="activities-stage-top">
              <span>✨ Magical Garden ✨</span>

              <div className="activities-combo">
                🔥 Combo: {combo}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={message}
                className="activities-speech"
                initial={{
                  opacity: 0,
                  y: 15,
                  scale: 0.85,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{ opacity: 0 }}
              >
                {message}
              </motion.div>
            </AnimatePresence>

            <div className="activities-character-area">
              <SavedMochi action={action} />

              <AnimatePresence>
                {active && (
                  <motion.div
                    key={effectKey}
                    className="activities-effect"
                    initial={{
                      opacity: 0,
                      y: 60,
                      scale: 0.4,
                    }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      y: [60, -25, -110],
                      scale: [0.4, 1.3, 1],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    {active === "dance"
                      ? "🎵 🎶 ✨"
                      : active === "jump"
                        ? "⭐ 🌈 ⭐"
                        : "💕 💗 💕"}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="activities-ground" aria-hidden="true">
              🌷 🌼 🌸 🌻 🌷
            </div>
          </motion.section>

          <motion.aside
            className="activities-sidebar"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="activities-panel">
              <h2>🎮 Choose an Activity</h2>
              <p>Pick something fun to do with Mochi!</p>

              <div className="activities-options">
                {activities.map((item) => {
                  const Icon = item.icon;

                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      disabled={active !== null || !ready}
                      onClick={() =>
                        startActivity(item.id)
                      }
                      className={`activities-option ${item.className}`}
                      whileHover={{ x: 5, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <span className="activities-option-icon">
                        <Icon size={25} />
                      </span>

                      <span className="activities-option-info">
                        <strong>{item.title}</strong>
                        <small>{item.description}</small>
                      </span>

                      <span className="activities-reward">
                        +{item.reward} ⭐
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {active && (
                <div className="activities-playing">
                  <Play size={16} fill="currentColor" />
                  Activity in progress...
                </div>
              )}
            </div>

            <div className="activities-panel activities-stats">
              <h2>⭐ Your Magical Progress</h2>

              <div className="activities-stat-grid">
                <div>
                  <strong>{progress.stars}</strong>
                  <span>Total Stars</span>
                </div>

                <div>
                  <strong>{progress.completed}</strong>
                  <span>Activities</span>
                </div>

                <div>
                  <strong>{progress.bestCombo}</strong>
                  <span>Best Combo</span>
                </div>

                <div>
                  <strong>{unlockedCount}/6</strong>
                  <span>Achievements</span>
                </div>
              </div>

              <button
                type="button"
                className="activities-reset"
                onClick={resetProgress}
                disabled={active !== null}
              >
                <RotateCcw size={15} />
                Reset Progress
              </button>
            </div>
          </motion.aside>
        </div>

        <section className="achievements-section">
          <div className="achievements-heading">
            <Trophy size={26} />
            <h2>Magical Achievements</h2>
          </div>

          <div className="achievements-grid">
            {achievements.map((achievement) => {
              const unlocked =
                achievement.unlocked(progress);

              return (
                <motion.div
                  key={achievement.title}
                  className={`achievement-card ${
                    unlocked ? "unlocked" : "locked"
                  }`}
                  whileHover={{ y: -6 }}
                >
                  <div className="achievement-emoji">
                    {unlocked ? achievement.emoji : "🔒"}
                  </div>

                  <strong>{achievement.title}</strong>

                  <p>{achievement.description}</p>

                  <span>
                    {unlocked ? "✨ Unlocked!" : "Not yet unlocked"}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </section>

        <footer className="activities-footer">
          Made with 💗 in Mochi World
        </footer>
      </div>
    </main>
  );
}
