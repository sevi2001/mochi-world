
"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { playSound } from "@/lib/sounds";

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEnabled(
      localStorage.getItem("mochi_sound") === "on"
    );
    setReady(true);
  }, []);

  const toggleSound = () => {
    const next = !enabled;

    setEnabled(next);
    localStorage.setItem(
      "mochi_sound",
      next ? "on" : "off"
    );

    if (next) {
      playSound("magic");
    }
  };

  return (
    <button
      type="button"
      onClick={toggleSound}
      disabled={!ready}
      className="mochi-sound-toggle"
      aria-label={
        enabled ? "Mute Mochi sounds" : "Enable Mochi sounds"
      }
      aria-pressed={enabled}
      title={enabled ? "Mute sounds" : "Enable sounds"}
    >
      {enabled ? (
        <Volume2 size={21} />
      ) : (
        <VolumeX size={21} />
      )}
    </button>
  );
}
