// Sound design system for subtle audio feedback
// Uses Web Audio API for low-latency, high-quality sounds

class SoundManager {
  private audioContext: AudioContext | null = null;
  private masterVolume = 0.3;
  private enabled = true;

  constructor() {
    // Initialize on first user interaction
    if (typeof window !== "undefined") {
      const initAudio = () => {
        if (!this.audioContext) {
          this.audioContext = new AudioContext();
        }
        window.removeEventListener("click", initAudio);
        window.removeEventListener("keydown", initAudio);
      };
      window.addEventListener("click", initAudio);
      window.addEventListener("keydown", initAudio);
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  private createOscillator(
    frequency: number,
    type: OscillatorType,
    duration: number,
    volume: number = 1
  ) {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    const adjustedVolume = volume * this.masterVolume;
    gainNode.gain.setValueAtTime(adjustedVolume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + duration
    );

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Soft click for buttons
  click() {
    this.createOscillator(800, "sine", 0.05, 0.3);
  }

  // Satisfying hover sound
  hover() {
    this.createOscillator(600, "sine", 0.03, 0.15);
  }

  // Success sound (ascending notes)
  success() {
    if (!this.audioContext || !this.enabled) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.createOscillator(freq, "sine", 0.15, 0.25);
      }, i * 80);
    });
  }

  // Error sound (descending)
  error() {
    if (!this.audioContext || !this.enabled) return;

    const notes = [392, 349.23, 311.13]; // G4, F4, Eb4
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.createOscillator(freq, "triangle", 0.12, 0.2);
      }, i * 60);
    });
  }

  // Notification ping
  notification() {
    if (!this.audioContext || !this.enabled) return;

    this.createOscillator(1046.5, "sine", 0.1, 0.3); // C6
    setTimeout(() => {
      this.createOscillator(1318.51, "sine", 0.15, 0.2); // E6
    }, 100);
  }

  // Whoosh sound for transitions
  whoosh() {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      2000,
      this.audioContext.currentTime + 0.1
    );

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.1 * this.masterVolume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + 0.15
    );

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  // Magical sparkle
  sparkle() {
    if (!this.audioContext || !this.enabled) return;

    const notes = [1760, 2093, 2637, 3136]; // A6, C7, E7, G7
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.createOscillator(freq, "sine", 0.08, 0.15);
      }, i * 40);
    });
  }

  // Achievement unlock sound
  achievement() {
    if (!this.audioContext || !this.enabled) return;

    // Fanfare-like ascending pattern
    const pattern = [
      { freq: 523.25, delay: 0 },    // C5
      { freq: 659.25, delay: 100 },  // E5
      { freq: 783.99, delay: 200 },  // G5
      { freq: 1046.5, delay: 350 },  // C6
    ];

    pattern.forEach(({ freq, delay }) => {
      setTimeout(() => {
        this.createOscillator(freq, "sine", 0.25, 0.35);
        this.createOscillator(freq * 2, "sine", 0.25, 0.15); // Harmonic
      }, delay);
    });
  }

  // Ambient drone for discovery mode
  ambientDrone() {
    if (!this.audioContext || !this.enabled) return;

    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator1.type = "sine";
    oscillator1.frequency.setValueAtTime(110, this.audioContext.currentTime); // A2

    oscillator2.type = "sine";
    oscillator2.frequency.setValueAtTime(165, this.audioContext.currentTime); // E3

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      0.08 * this.masterVolume,
      this.audioContext.currentTime + 0.5
    );
    gainNode.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + 3
    );

    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator1.start(this.audioContext.currentTime);
    oscillator2.start(this.audioContext.currentTime);
    oscillator1.stop(this.audioContext.currentTime + 3);
    oscillator2.stop(this.audioContext.currentTime + 3);
  }
}

export const sounds = new SoundManager();

// React hook for sound effects
import { useCallback } from "react";

export function useSound() {
  const playClick = useCallback(() => sounds.click(), []);
  const playHover = useCallback(() => sounds.hover(), []);
  const playSuccess = useCallback(() => sounds.success(), []);
  const playError = useCallback(() => sounds.error(), []);
  const playNotification = useCallback(() => sounds.notification(), []);
  const playWhoosh = useCallback(() => sounds.whoosh(), []);
  const playSparkle = useCallback(() => sounds.sparkle(), []);
  const playAchievement = useCallback(() => sounds.achievement(), []);
  const playAmbientDrone = useCallback(() => sounds.ambientDrone(), []);

  return {
    playClick,
    playHover,
    playSuccess,
    playError,
    playNotification,
    playWhoosh,
    playSparkle,
    playAchievement,
    playAmbientDrone,
    setEnabled: (enabled: boolean) => sounds.setEnabled(enabled),
    setVolume: (volume: number) => sounds.setVolume(volume),
  };
}
