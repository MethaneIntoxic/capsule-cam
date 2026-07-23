// src/hooks/useSound.ts
// Preload and play sound effects. Gracefully handles missing files and web.

import { useState, useCallback, useEffect, useRef } from "react";
import { settingsRepository } from "../storage/settingsRepository";

// Lazy-require native module — no-op on web
let AudioModule: any = null;
let SoundClass: any = null;
try {
  AudioModule = require("expo-av");
  SoundClass = AudioModule.Audio?.Sound ?? AudioModule.Sound;
} catch {
  // Native module not available (web)
}

type SoundName =
  | "handleClick"
  | "capsuleRattle"
  | "capsuleDrop"
  | "trayImpact"
  | "capsuleOpen"
  | "revealChime";

const SOUND_MAP: Record<SoundName, string> = {
  handleClick: "handle-click",
  capsuleRattle: "capsule-rattle",
  capsuleDrop: "capsule-drop",
  trayImpact: "tray-impact",
  capsuleOpen: "capsule-open",
  revealChime: "reveal-chime",
};

function playWebSynth(name: string) {
  try {
    if (typeof window === "undefined") return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (name === "handleClick") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (name === "capsuleRattle") {
      osc.type = "square";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (name === "trayImpact" || name === "capsuleDrop") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (name === "capsuleOpen" || name === "revealChime") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch {}
}

export function useSound() {
  const [isMuted, setIsMuted] = useState(false);
  const soundRefs = useRef<Record<string, any | null>>({});

  useEffect(() => {
    settingsRepository.get().then((s) => setIsMuted(s.isMuted));

    if (!AudioModule) return;

    const Audio = AudioModule.Audio;
    if (!Audio) return;

    const loadSounds = async () => {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: false });
      for (const [key, filename] of Object.entries(SOUND_MAP)) {
        try {
          const { sound } = await Audio.Sound.createAsync(
            { uri: `file:///assets/sounds/${filename}.mp3` },
            { shouldPlay: false }
          );
          soundRefs.current[key] = sound;
        } catch {
          soundRefs.current[key] = null;
        }
      }
    };
    loadSounds();

    return () => {
      for (const sound of Object.values(soundRefs.current)) {
        sound?.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const play = useCallback(
    async (name: SoundName) => {
      if (isMuted) return;
      const sound = soundRefs.current[name];
      if (sound) {
        try {
          await sound.replayAsync();
        } catch {
          playWebSynth(name);
        }
      } else {
        playWebSynth(name);
      }
    },
    [isMuted]
  );

  const toggleMute = useCallback(async () => {
    const next = !isMuted;
    setIsMuted(next);
    await settingsRepository.update({ isMuted: next });
  }, [isMuted]);

  return { isMuted, toggleMute, play };
}
