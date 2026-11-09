
export type SoundName =
  | "click"
  | "pet"
  | "jump"
  | "wave"
  | "dance"
  | "magic"
  | "reward"
  | "sleep";

let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;

  if (!audioContext) {
    audioContext = new AudioContext();
  }

  return audioContext;
}

function playNote(
  frequency: number,
  start: number,
  duration: number,
  volume = 0.06,
  type: OscillatorType = "sine"
) {
  const context = getAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(
    frequency,
    context.currentTime + start
  );

  const startTime = context.currentTime + start;
  const endTime = startTime + duration;

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(
    volume,
    startTime + 0.015
  );
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    endTime
  );

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(startTime);
  oscillator.stop(endTime);
}

export function playSound(name: SoundName) {
  if (typeof window === "undefined") return;

  try {
    if (localStorage.getItem("mochi_sound") === "off") {
      return;
    }

    const context = getAudioContext();
    if (!context) return;

    if (context.state === "suspended") {
      void context.resume();
    }

    switch (name) {
      case "click":
        playNote(650, 0, 0.09, 0.025);
        break;

      case "pet":
        playNote(650, 0, 0.12);
        playNote(850, 0.09, 0.18);
        break;

      case "jump":
        playNote(300, 0, 0.12, 0.06, "triangle");
        playNote(550, 0.12, 0.2, 0.05);
        break;

      case "wave":
        playNote(700, 0, 0.12);
        playNote(900, 0.12, 0.18);
        break;

      case "dance":
        [523, 659, 784, 1046].forEach((note, i) => {
          playNote(note, i * 0.14, 0.18);
        });
        break;

      case "magic":
        [600, 800, 1000, 1300].forEach((note, i) => {
          playNote(note, i * 0.08, 0.28, 0.035);
        });
        break;

      case "reward":
        [523, 659, 784, 1046, 1318].forEach(
          (note, i) => {
            playNote(note, i * 0.12, 0.25);
          }
        );
        break;

      case "sleep":
        [523, 440, 349, 261].forEach((note, i) => {
          playNote(note, i * 0.25, 0.45, 0.025);
        });
        break;
    }
  } catch (error) {
    console.warn("Sound unavailable:", error);
  }
}
