// src/storage/settingsRepository.ts
// Simple key-value persistence for app settings.

import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "@capsulecam/settings";

export interface AppSettings {
  isMuted: boolean;
  hasCompletedOnboarding: boolean;
  activeTheme: string;
  seenCount: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  isMuted: false,
  hasCompletedOnboarding: false,
  activeTheme: "classic_red",
  seenCount: 0,
};

export const settingsRepository = {
  async get(): Promise<AppSettings> {
    try {
      const raw = await AsyncStorage.getItem(SETTINGS_KEY);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  },

  async update(patch: Partial<AppSettings>): Promise<void> {
    try {
      const current = await this.get();
      const merged = { ...current, ...patch };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
    } catch (e) {
      console.error("Failed to update settings:", e);
    }
  },

  async reset(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SETTINGS_KEY);
    } catch (e) {
      console.error("Failed to reset settings:", e);
    }
  },
};
