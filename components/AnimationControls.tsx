
"use client";

import { motion } from "motion/react";
import {
  Hand,
  ArrowUp,
  Music2,
  Moon,
  Heart,
  RotateCcw,
} from "lucide-react";

import type { MochiAction } from "./MochiCharacter";

type Props = {
  action: MochiAction;
  onActionChange: (action: MochiAction) => void;
};

const actions = [
  { id: "wave", label: "Wave", icon: Hand },
  { id: "jump", label: "Jump", icon: ArrowUp },
  { id: "dance", label: "Dance", icon: Music2 },
  { id: "sleep", label: "Sleep", icon: Moon },
  { id: "love", label: "Love", icon: Heart },
  { id: "idle", label: "Reset", icon: RotateCcw },
] as const;

export default function AnimationControls({
  action,
  onActionChange,
}: Props) {
  return (
    <div className="animation-controls">
      <div className="controls-heading">
        <span>✨</span>
        <h3>Play with Mochi!</h3>
        <p>Choose a magical action</p>
      </div>

      <div className="controls-buttons">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => onActionChange(item.id)}
              className={`action-button ${
                action === item.id ? "selected" : ""
              }`}
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
