
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import AnimationControls from "@/components/AnimationControls";
import type { MochiAction } from "@/components/MochiCharacter";
import {
  Gamepad2,
  Palette,
  Music2,
  Moon,
  Sparkles,
  Heart,
  ArrowRight,
} from "lucide-react";

import MochiCharacter from "@/components/MochiCharacter";

const features = [
  {
    title: "Play",
    description: "Interact, click and discover cute reactions!",
    icon: Gamepad2,
    color: "pink",
    emoji: "💗",
    href: "/play",
  },
  {
    title: "Activities",
    description: "Dance, jump and enjoy magical moments!",
    icon: Music2,
    color: "green",
    emoji: "🎵",
    href: "/activities",
  },
  {
    title: "Customize",
    description: "Change colors, hats and accessories!",
    icon: Palette,
    color: "yellow",
    emoji: "🎨",
    href: "/customize",
  },
  {
    title: "Rest",
    description: "Let Mochi sleep and recharge!",
    icon: Moon,
    color: "purple",
    emoji: "🌙",
    href: "/rest",
  },
];

const decorations = [
  { emoji: "🌸", top: "15%", left: "5%", delay: 0 },
  { emoji: "✨", top: "24%", left: "46%", delay: 1 },
  { emoji: "🌼", top: "65%", left: "8%", delay: 2 },
  { emoji: "💗", top: "42%", left: "90%", delay: 1.5 },
  { emoji: "⭐", top: "16%", left: "83%", delay: 0.5 },
  { emoji: "🦋", top: "70%", left: "86%", delay: 2.5 },
];

export default function Home() {
  const [action, setAction] = useState<MochiAction>("idle");

  return (
    <main className="world">
      <div className="floating-decorations" aria-hidden="true">
        {decorations.map((item, index) => (
          <motion.span
            key={index}
            className="decoration"
            style={{ top: item.top, left: item.left }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 12, -12, 0],
            }}
            transition={{
              duration: 4,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {item.emoji}
          </motion.span>
        ))}
      </div>

      <header className="navbar">
        <Link href="/" className="logo">
          <span>🌱</span>
          Mochi<span className="logo-green">World</span>
          <Heart size={17} className="logo-heart" />
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/" className="active">Home</Link>
          <Link href="/play">Play</Link>
          <Link href="/customize">Customize</Link>
          <Link href="/activities">Activities</Link>
          <Link href="/rest">Rest</Link>
        </nav>

        <div className="nav-avatar">🌸</div>
      </header>

      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: -70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-tag">
            <Sparkles size={17} />
            Meet Your Magical Little Friend!
          </div>

          <h1>
            Welcome to
            <span>
              <strong className="pink-text">Mochi</strong>{" "}
              <strong className="green-text">World</strong>
            </span>
          </h1>

          <p>
            A tiny magical friend is waiting for you!
            Play, explore, customize, and make beautiful
            memories with your adorable Mochi.
          </p>

          <div className="hero-buttons">
            <Link href="/play" className="primary-btn">
              Play with Mochi
              <ArrowRight size={19} />
            </Link>

            <Link href="/customize" className="secondary-btn">
              Customize
              <Palette size={18} />
            </Link>
          </div>

          <div className="hero-note">
            💕 Your magical adventure starts here!
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            type: "spring",
            bounce: 0.35,
          }}
        >
          <motion.div
            className="speech-bubble"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Hi there! 👋
            <span>I'm Mochi! Click me! 💗</span>
          </motion.div>

         <MochiCharacter action={action} />
        </motion.div>
      </section>

      <section className="features">
        <AnimationControls
  action={action}
  onActionChange={setAction}
/>
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.15 }}
              whileHover={{ y: -12, scale: 1.03 }}
            >
              <Link
                href={feature.href}
                className={`feature-card ${feature.color}`}
              >
                <div className="feature-emoji">{feature.emoji}</div>
                <Icon size={32} className="feature-icon" />

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>

                <span className="feature-arrow">
                  Explore <ArrowRight size={15} />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </section>

      <footer className="footer">
        Made with 💗 for magical little moments.
      </footer>
    </main>
  );
}
