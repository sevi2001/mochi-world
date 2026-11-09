
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Moon,
  Sun,
  BatteryCharging,
  Heart,
  Sparkles,
  BedDouble,
  AlarmClock,
} from "lucide-react";

import SavedMochi from "@/components/SavedMochi";

const STORAGE_KEY = "mochi_rest_state";

type RestState = {
  energy: number;
  sleeping: boolean;
};

const defaultRest: RestState = {
  energy: 60,
  sleeping: false,
};

function isRestState(value: unknown): value is RestState {
  if (!value || typeof value !== "object") return false;

  const state = value as Partial<RestState>;

  return (
    typeof state.energy === "number" &&
    Number.isFinite(state.energy) &&
    state.energy >= 0 &&
    state.energy <= 100 &&
    typeof state.sleeping === "boolean"
  );
}

export default function RestPage() {
  const [energy, setEnergy] = useState(60);
  const [sleeping, setSleeping] = useState(false);
  const [night, setNight] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState(
    "A little rest makes every day magical! 💗"
  );

  const latestState = useRef<RestState>(defaultRest);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (isRestState(parsed)) {
          setEnergy(parsed.energy);
          setSleeping(parsed.sleeping);
          setNight(parsed.sleeping);
        }
      }
    } catch {
      // Continue with default state.
    }

    setReady(true);
  }, []);

  useEffect(() => {
    latestState.current = { energy, sleeping };

    if (!ready) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ energy, sleeping })
      );
    } catch {
      // The room still works without storage.
    }
  }, [energy, sleeping, ready]);

  useEffect(() => {
    if (!ready || !sleeping) return;

    const interval = setInterval(() => {
      setEnergy((previous) => Math.min(100, previous + 1));
    }, 1500);

    return () => clearInterval(interval);
  }, [sleeping, ready]);

  const putToSleep = () => {
    setSleeping(true);
    setNight(true);
    setMessage("Shhh... Mochi is dreaming! 😴");
  };

  const wakeUp = () => {
    setSleeping(false);
    setNight(false);
    setMessage("Good morning! I feel wonderful! ☀️");
  };

  const toggleDayNight = () => {
    setNight((previous) => !previous);
  };

  return (
    <main className={`rest-world ${night ? "night" : "day"}`}>
      <div className="rest-sky" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className="rest-star"
            style={{
              left: `${(index * 37 + 11) % 100}%`,
              top: `${(index * 23 + 7) % 75}%`,
              animationDelay: `${(index % 6) * 0.4}s`,
            }}
          >
            ✦
          </span>
        ))}

        <motion.div
          className="rest-celestial"
          animate={{
            rotate: night ? 180 : 0,
            scale: night ? 0.9 : 1,
          }}
          transition={{ duration: 0.8 }}
        >
          {night ? "🌙" : "☀️"}
        </motion.div>

        <span className="rest-cloud rest-cloud-one">☁️</span>
        <span className="rest-cloud rest-cloud-two">☁️</span>
      </div>

      <div className="rest-container">
        <header className="rest-header">
          <Link href="/" className="rest-back">
            <ArrowLeft size={18} />
            Back Home
          </Link>

          <strong>🌙 Mochi's Dreamy Bedroom</strong>

          <button
            type="button"
            onClick={toggleDayNight}
            className="rest-theme-toggle"
            aria-label={night ? "Switch to day" : "Switch to night"}
          >
            {night ? <Sun size={18} /> : <Moon size={18} />}
            {night ? "Day Mode" : "Night Mode"}
          </button>
        </header>

        <motion.section
          className="rest-heading"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="rest-tag">
            <Sparkles size={17} />
            Sweet Dreams, Little Mochi!
          </span>

          <h1>
            Time to <span>Rest!</span>
          </h1>

          <p>
            Every magical friend needs a little
            rest to recharge their sparkle.
          </p>
        </motion.section>

        <div className="rest-layout">
          <motion.section
            className="rest-bedroom"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="rest-bedroom-top">
              <span>
                {night ? "🌙 Dreamy Night" : "☀️ Cozy Day"}
              </span>

              <span>✨ Sweet Dreams ✨</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={message}
                className="rest-speech"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {message}
              </motion.div>
            </AnimatePresence>

            <div className="rest-character-area">
              <SavedMochi
                action={sleeping ? "sleep" : "idle"}
              />
            </div>

            <div className="rest-bed" aria-hidden="true">
              <span className="rest-pillow">☁️</span>
              <span className="rest-blanket">💜</span>
            </div>

            <div className="rest-bedroom-bottom" aria-hidden="true">
              <span>🪴</span>
              <span>🧸</span>
              <span>🌸</span>
            </div>
          </motion.section>

          <motion.aside
            className="rest-sidebar"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="rest-panel">
              <div className="rest-energy-heading">
                <div>
                  <span>⚡ Mochi's Energy</span>
                  <h2>{energy}%</h2>
                </div>

                <BatteryCharging size={40} />
              </div>

              <div
                className="rest-energy-track"
                role="progressbar"
                aria-label="Mochi's energy"
                aria-valuenow={energy}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <motion.div
                  className="rest-energy-fill"
                  animate={{ width: `${energy}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <p>
                {energy === 100
                  ? "Mochi is fully recharged! ✨"
                  : sleeping
                    ? "Sweet dreams! Energy is recharging..."
                    : "Help Mochi recharge by taking a nap."}
              </p>
            </div>

            <div className="rest-panel">
              <h2>🛏️ Sleepy Time</h2>
              <p>
                Let Mochi relax in this magical bedroom.
              </p>

              <div className="rest-actions">
                <motion.button
                  type="button"
                  onClick={putToSleep}
                  disabled={sleeping}
                  className="rest-sleep-button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BedDouble size={20} />
                  Put Mochi to Sleep
                </motion.button>

                <motion.button
                  type="button"
                  onClick={wakeUp}
                  disabled={!sleeping}
                  className="rest-wake-button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AlarmClock size={20} />
                  Wake Up Mochi
                </motion.button>
              </div>
            </div>

            <div className="rest-panel rest-status-panel">
              <h2>💗 Mochi's Status</h2>

              <div className="rest-status">
                <span>
                  {sleeping ? "😴" : "😊"}
                </span>

                <div>
                  <strong>
                    {sleeping ? "Sleeping" : "Awake & Happy"}
                  </strong>

                  <small>
                    {sleeping
                      ? "Dreaming of magical adventures"
                      : "Ready for more adventures"}
                  </small>
                </div>
              </div>

              <div className="rest-love-note">
                <Heart size={17} fill="currentColor" />
                You're taking wonderful care of Mochi!
              </div>
            </div>
          </motion.aside>
        </div>

        <footer className="rest-footer">
          Made with 💜 in Mochi World
        </footer>
      </div>
    </main>
  );
}
