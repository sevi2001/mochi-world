
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Palette,
  Sparkles,
  RotateCcw,
  Check,
  Heart,
} from "lucide-react";

import MochiCharacter from "@/components/MochiCharacter";

import {
  defaultCustomization,
  MOCHI_STORAGE_KEY,
  type MochiCustomization,
  type MochiColor,
  type MochiAccessory,
  type MochiWings,
} from "@/types/mochi";

const colors: {
  id: MochiColor;
  name: string;
  hex: string;
}[] = [
  { id: "mint", name: "Mint", hex: "#98e3a5" },
  { id: "pink", name: "Pink", hex: "#ffb5d1" },
  { id: "lavender", name: "Lavender", hex: "#cbb8ff" },
  { id: "peach", name: "Peach", hex: "#ffc49f" },
  { id: "blue", name: "Sky Blue", hex: "#a6ddff" },
  { id: "cream", name: "Cream", hex: "#fff0b8" },
];

const accessories: {
  id: MochiAccessory;
  name: string;
  emoji: string;
}[] = [
  { id: "none", name: "None", emoji: "✨" },
  { id: "bow", name: "Bow", emoji: "🎀" },
  { id: "crown", name: "Crown", emoji: "👑" },
  { id: "flower", name: "Flower", emoji: "🌸" },
  { id: "star", name: "Stars", emoji: "⭐" },
];

const wings: {
  id: MochiWings;
  name: string;
  emoji: string;
}[] = [
  { id: "fairy", name: "Fairy", emoji: "🧚" },
  { id: "butterfly", name: "Butterfly", emoji: "🦋" },
  { id: "none", name: "No Wings", emoji: "💗" },
];

function isCustomization(
  value: unknown
): value is MochiCustomization {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;

  return (
    colors.some((color) => color.id === item.color) &&
    accessories.some((accessory) => accessory.id === item.accessory) &&
    wings.some((wing) => wing.id === item.wings)
  );
}

export default function CustomizePage() {
  const [customization, setCustomization] =
    useState<MochiCustomization>(defaultCustomization);

  const [ready, setReady] = useState(false);
  const [sparkleKey, setSparkleKey] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(MOCHI_STORAGE_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (isCustomization(parsed)) {
          setCustomization(parsed);
        }
      }
    } catch {
      // Continue with default settings.
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(
        MOCHI_STORAGE_KEY,
        JSON.stringify(customization)
      );
    } catch {
      // Customization still works without storage.
    }
  }, [customization, ready]);

  const updateCustomization = (
    changes: Partial<MochiCustomization>
  ) => {
    setCustomization((previous) => ({
      ...previous,
      ...changes,
    }));

    setSparkleKey((previous) => previous + 1);
  };

  const resetCustomization = () => {
    setCustomization({ ...defaultCustomization });
    setSparkleKey((previous) => previous + 1);
  };

  return (
    <main className="customize-world">
      <div className="customize-background" aria-hidden="true">
        <span>🌸</span>
        <span>✨</span>
        <span>🦋</span>
        <span>💗</span>
        <span>⭐</span>
      </div>

      <div className="customize-container">
        <header className="customize-header">
          <Link href="/" className="customize-back">
            <ArrowLeft size={19} />
            Back Home
          </Link>

          <div className="customize-brand">
            🎀 Mochi's Dressing Room
          </div>

          <span className="customize-header-heart">
            <Heart size={18} fill="currentColor" />
          </span>
        </header>

        <motion.div
          className="customize-heading"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="customize-tag">
            <Sparkles size={17} />
            Make Mochi Your Own!
          </span>

          <h1>
            Customize <span>Mochi!</span>
          </h1>

          <p>
            Choose your favorite colors, accessories,
            and magical wings!
          </p>
        </motion.div>

        <div className="customize-layout">
          <motion.section
            className="customize-preview"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="preview-title">
              ✨ Your Magical Mochi
            </div>

            <div className="preview-stage">
              <div className="preview-stars" aria-hidden="true">
                ✨ ⭐ ✨
              </div>

              <MochiCharacter
                customization={customization}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={sparkleKey}
                  className="customize-sparkles"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.3, 1.6],
                    rotate: [0, 20, -20],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1 }}
                >
                  ✨ 💖 ✨
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="preview-bottom">
              <span>💚 Looking magical!</span>

              <button
                type="button"
                onClick={resetCustomization}
                className="customize-reset"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </motion.section>

          <motion.section
            className="customize-options"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="customize-option-card">
              <div className="option-heading">
                <Palette size={22} />
                <h2>Body Color</h2>
              </div>

              <p>Pick Mochi's magical color!</p>

              <div className="color-options">
                {colors.map((color) => (
                  <motion.button
                    key={color.id}
                    type="button"
                    aria-label={color.name}
                    aria-pressed={customization.color === color.id}
                    className={`color-option ${
                      customization.color === color.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      updateCustomization({ color: color.id })
                    }
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span
                      className="color-circle"
                      style={{ background: color.hex }}
                    >
                      {customization.color === color.id && (
                        <Check size={20} />
                      )}
                    </span>
                    <small>{color.name}</small>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="customize-option-card">
              <div className="option-heading">
                <Sparkles size={22} />
                <h2>Accessories</h2>
              </div>

              <p>Add something adorable!</p>

              <div className="accessory-options">
                {accessories.map((item) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    aria-pressed={
                      customization.accessory === item.id
                    }
                    className={`accessory-option ${
                      customization.accessory === item.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      updateCustomization({
                        accessory: item.id,
                      })
                    }
                    whileHover={{ y: -5, scale: 1.04 }}
                    whileTap={{ scale: 0.93 }}
                  >
                    <span>{item.emoji}</span>
                    <small>{item.name}</small>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="customize-option-card">
              <div className="option-heading">
                <Sparkles size={22} />
                <h2>Magical Wings</h2>
              </div>

              <p>How should Mochi fly?</p>

              <div className="wing-options">
                {wings.map((item) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    aria-pressed={
                      customization.wings === item.id
                    }
                    className={`wing-option ${
                      customization.wings === item.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      updateCustomization({
                        wings: item.id,
                      })
                    }
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{item.emoji}</span>
                    <strong>{item.name}</strong>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="customize-save-note">
              <Check size={18} />
              Your changes are saved automatically!
            </div>
          </motion.section>
        </div>

        <footer className="customize-footer">
          Made with 💗 in Mochi World
        </footer>
      </div>
    </main>
  );
}
