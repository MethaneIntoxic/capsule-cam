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

export function useSound() {
  const [isMuted, setIsMuted] = useState(false);
  const soundRefs = useRef<Record<string, any | null>>({});

  useEffect(() => {
    settingsRepository.get().then((s) => setIsMuted(s.isMuted));

    if (!AudioModule) return; // web — no sound

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
      if (isMuted || !AudioModule) return;
      const sound = soundRefs.current[name];
      if (!sound) return;
      try {
        await sound.replayAsync();
      } catch {}
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
