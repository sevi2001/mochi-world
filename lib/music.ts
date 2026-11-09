
export type MusicMood = "garden" | "play" | "sleep";

type Note = {
  frequency: number;
  duration: number;
};

const melodies: Record<MusicMood, Note[]> = {
  garden: [
    { frequency: 523.25, duration: 0.4 },
    { frequency: 659.25, duration: 0.4 },
    { frequency: 783.99, duration: 0.6 },
    { frequency: 659.25, duration: 0.4 },
    { frequency: 587.33, duration: 0.4 },
    { frequency: 523.25, duration: 0.8 },
  ],
  play: [
    { frequency: 659.25, duration: 0.25 },
    { frequency: 783.99, duration: 0.25 },
    { frequency: 880, duration: 0.25 },
    { frequency: 1046.5, duration: 0.45 },
    { frequency: 880, duration: 0.25 },
    { frequency: 783.99, duration: 0.25 },
    { frequency: 659.25, duration: 0.5 },
  ],
  sleep: [
    { frequency: 392, duration: 0.8 },
    { frequency: 349.23, duration: 0.8 },
    { frequency: 329.63, duration: 1 },
    { frequency: 261.63, duration: 1.4 },
  ],
};

let context: AudioContext | null = null;
let masterGain: GainNode | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let activeOscillators = new Set<OscillatorNode>();
let playing = false;
let currentMood: MusicMood = "garden";
let currentVolume = 0.25;
let nextNoteIndex = 0;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!context) {
    context = new AudioContext();
    masterGain = context.createGain();
    masterGain.gain.value = currentVolume * 0.12;
    masterGain.connect(context.destination);
  }

  return context;
}

function stopOscillators() {
  activeOscillators.forEach((oscillator) => {
    try {
      oscillator.stop();
    } catch {
      // Oscillator may already have stopped.
    }
  });

  activeOscillators.clear();
}

function playNote(frequency: number, duration: number) {
  const ctx = getContext();
  if (!ctx || !masterGain) return;

  const oscillator = ctx.createOscillator();
  const envelope = ctx.createGain();

  oscillator.type =
    currentMood === "sleep" ? "sine" : "triangle";

  oscillator.frequency.value = frequency;

  const now = ctx.currentTime;

  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(
    0.65,
    now + 0.025
  );
  envelope.gain.exponentialRampToValueAtTime(
    0.0001,
    now + duration
  );

  oscillator.connect(envelope);
  envelope.connect(masterGain);

  activeOscillators.add(oscillator);

  oscillator.onended = () => {
    activeOscillators.delete(oscillator);
    oscillator.disconnect();
    envelope.disconnect();
  };

  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function scheduleNextNote() {
  if (!playing) return;

  const melody = melodies[currentMood];
  const note = melody[nextNoteIndex % melody.length];

  playNote(note.frequency, note.duration);

  nextNoteIndex++;

  const gap = currentMood === "sleep" ? 1.25 : 1.1;

  timer = setTimeout(
    scheduleNextNote,
    note.duration * gap * 1000
  );
}

export async function startMusic(
  mood: MusicMood = "garden"
) {
  const ctx = getContext();
  if (!ctx) return;

  try {
    await ctx.resume();
  } catch {
    return;
  }

  if (ctx.state !== "running") return;

  if (playing) {
    if (currentMood !== mood) {
      setMusicMood(mood);
    }
    return;
  }

  currentMood = mood;
  nextNoteIndex = 0;
  playing = true;

  scheduleNextNote();
}

export function stopMusic() {
  playing = false;

  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  stopOscillators();
}

export function setMusicMood(mood: MusicMood) {
  if (currentMood === mood) return;

  currentMood = mood;
  nextNoteIndex = 0;

  if (playing) {
    stopMusic();
    playing = true;
    scheduleNextNote();
  }
}

export function setMusicVolume(volume: number) {
  currentVolume = Math.max(0, Math.min(1, volume));

  if (masterGain && context) {
    masterGain.gain.setTargetAtTime(
      currentVolume * 0.12,
      context.currentTime,
      0.05
    );
  }
}

export function isMusicPlaying() {
  return playing;
}
