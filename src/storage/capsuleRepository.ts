// src/storage/capsuleRepository.ts
// AsyncStorage-backed CRUD for Capsule entities.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Capsule } from "../models/Capsule";

const COLLECTION_KEY = "@capsulecam/collection";

export const capsuleRepository = {
  async getAll(): Promise<Capsule[]> {
    try {
      const raw = await AsyncStorage.getItem(COLLECTION_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as Capsule[];
    } catch {
      return [];
    }
  },

  async save(capsule: Capsule): Promise<void> {
    try {
      const all = await this.getAll();
      const index = all.findIndex((c) => c.id === capsule.id);
      if (index >= 0) {
        all[index] = capsule;
      } else {
        all.unshift(capsule); // newest first
      }
      await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(all));
    } catch (e) {
      console.error("Failed to save capsule:", e);
    }
  },

  async delete(capsuleId: string): Promise<void> {
    try {
      const all = await this.getAll();
      const filtered = all.filter((c) => c.id !== capsuleId);
      await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error("Failed to delete capsule:", e);
    }
  },

  async getById(id: string): Promise<Capsule | null> {
    try {
      const all = await this.getAll();
      return all.find((c) => c.id === id) ?? null;
    } catch {
      return null;
    }
  },

  async getRecent(limit: number = 10): Promise<Capsule[]> {
    try {
      const all = await this.getAll();
      return all.slice(0, limit);
    } catch {
      return [];
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(COLLECTION_KEY);
    } catch (e) {
      console.error("Failed to clear collection:", e);
    }
  },
};
