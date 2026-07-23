// src/models/Rarity.ts
// Rarity configuration with weighted random distribution.

import { Rarity } from "./Capsule";

export interface RarityConfig {
  rarity: Rarity;
  weight: number;
  label: string;
  borderColor: string;
  glowColor: string;
  capsuleColorBias: string[];
}

export const RARITY_TABLE: RarityConfig[] = [
  {
    rarity: "common",
    weight: 75,
    label: "Common",
    borderColor: "#C0C0C0",
    glowColor: "#E0E0E0",
    capsuleColorBias: ["pink", "blue", "green", "yellow", "white"],
  },
  {
    rarity: "rare",
    weight: 20,
    label: "Rare",
    borderColor: "#4FC3F7",
    glowColor: "#81D4FA",
    capsuleColorBias: ["purple", "orange", "blue"],
  },
  {
    rarity: "special",
    weight: 5,
    label: "Special",
    borderColor: "#FFD700",
    glowColor: "#FFF176",
    capsuleColorBias: ["black", "purple"],
  },
];
