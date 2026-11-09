
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Music2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  startMusic,
  stopMusic,
  setMusicMood,
  setMusicVolume,
  type MusicMood,
} from "@/lib/music";

const MUSIC_KEY = "mochi_music_enabled";
const VOLUME_KEY = "mochi_music_volume";
const SOUND_KEY = "mochi_sound";

function getMood(pathname: string): MusicMood {
  if (pathname === "/rest") return "sleep";

  if (
    pathname === "/play" ||
    pathname === "/activities"
  ) {
    return "play";
  }

  return "garden";
}

export default function MochiMusicPlayer() {
  const pathname = usePathname();

  const [musicEnabled, setMusicEnabled] = useState(false);
  const [soundsEnabled, setSoundsEnabled] = useState(false);
  const [volume, setVolume] = useState(25);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const mood = getMood(pathname);

  useEffect(() => {
    setMusicEnabled(false);
    setSoundsEnabled(
      localStorage.getItem(SOUND_KEY) === "on"
    );

    const savedVolume = Number(
      localStorage.getItem(VOLUME_KEY) ?? "25"
    );

    const safeVolume = Number.isFinite(savedVolume)
      ? Math.max(0, Math.min(100, savedVolume))
      : 25;

    setVolume(safeVolume);
    setMusicVolume(safeVolume / 100);
    setReady(true);

    return () => stopMusic();
  }, []);

  useEffect(() => {
    setMusicMood(mood);
  }, [mood]);

  const toggleMusic = async () => {
    if (musicEnabled) {
      stopMusic();
      setMusicEnabled(false);
      localStorage.setItem(MUSIC_KEY, "off");
      return;
    }

    await startMusic(mood);
    setMusicEnabled(true);
    localStorage.setItem(MUSIC_KEY, "on");
  };

  const toggleSounds = () => {
    const next = !soundsEnabled;

    setSoundsEnabled(next);
    localStorage.setItem(
      SOUND_KEY,
      next ? "on" : "off"
    );
  };

  const changeVolume = (next: number) => {
    setVolume(next);
    setMusicVolume(next / 100);
    localStorage.setItem(VOLUME_KEY, String(next));
  };

  return (
    <div className="mochi-music-wrapper">
      <button
        type="button"
        className="mochi-music-fab"
        onClick={() => setOpen((previous) => !previous)}
        aria-label="Open music settings"
        aria-expanded={open}
        disabled={!ready}
      >
        <Music2 size={23} />
      </button>

      {open && (
        <div className="mochi-music-panel">
          <div className="mochi-music-heading">
            <div>
              <strong>🎵 Mochi's Music</strong>
              <small>Magical sound settings</small>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close music settings"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mochi-music-mood">
            <span>
              {mood === "sleep"
                ? "🌙 Dreamy Lullaby"
                : mood === "play"
                  ? "🎮 Happy Playtime"
                  : "🌸 Magical Garden"}
            </span>
          </div>

          <button
            type="button"
            className="mochi-music-action"
            onClick={toggleMusic}
          >
            {musicEnabled ? (
              <Pause size={19} />
            ) : (
              <Play size={19} />
            )}

            {musicEnabled ? "Pause Music" : "Play Music"}
          </button>

          <div className="mochi-music-setting">
            <span>
              {soundsEnabled ? (
                <Volume2 size={18} />
              ) : (
                <VolumeX size={18} />
              )}
              Sound Effects
            </span>

            <button
              type="button"
              onClick={toggleSounds}
              aria-pressed={soundsEnabled}
              className={`mochi-switch ${
                soundsEnabled ? "enabled" : ""
              }`}
            >
              <span />
            </button>
          </div>

          <div className="mochi-music-volume">
            <label htmlFor="mochi-volume">
              <SlidersHorizontal size={17} />
              Music Volume: {volume}%
            </label>

            <input
              id="mochi-volume"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(event) =>
                changeVolume(Number(event.target.value))
              }
            />
          </div>

          <p className="mochi-music-note">
            💗 Music changes automatically when you
            visit different rooms.
          </p>
        </div>
      )}
    </div>
  );
}
