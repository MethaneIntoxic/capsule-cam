// src/storage/migrations.ts
// Schema version management for local storage.

import AsyncStorage from "@react-native-async-storage/async-storage";

const VERSION_KEY = "@capsulecam/schema_version";
const CURRENT_VERSION = 1;

export async function getStoredVersion(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(VERSION_KEY);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

async function setStoredVersion(version: number): Promise<void> {
  await AsyncStorage.setItem(VERSION_KEY, version.toString());
}

export async function runMigrations(): Promise<void> {
  const version = await getStoredVersion();
  if (version < 1) {
    // v1: initial schema — nothing to migrate yet
  }
  await setStoredVersion(CURRENT_VERSION);
}
