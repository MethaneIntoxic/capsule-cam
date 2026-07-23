// src/hooks/useSound.ts
// Preload and play sound effects. Gracefully handles missing files.

import { useState, useCallback, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import { settingsRepository } from "../storage/settingsRepository";

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
  const soundRefs = useRef<Record<string, Audio.Sound | null>>({});

  useEffect(() => {
    // Load mute setting
    settingsRepository.get().then((s) => setIsMuted(s.isMuted));

    // Preload sounds (silently fail if assets don't exist yet)
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
          // Sound file may not exist yet (Phase 2 asset)
          soundRefs.current[key] = null;
        }
      }
    };
    loadSounds();

    return () => {
      // Unload all sounds
      for (const sound of Object.values(soundRefs.current)) {
        sound?.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const play = useCallback(
    async (name: SoundName) => {
      if (isMuted) return;
      const sound = soundRefs.current[name];
      if (!sound) return;
      try {
        await sound.replayAsync();
      } catch {
        // Silently fail
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
