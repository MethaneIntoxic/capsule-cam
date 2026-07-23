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
    weight: 60,
    label: "Common",
    borderColor: "#A0A0A8",
    glowColor: "#E0E0E0",
    capsuleColorBias: ["pink", "blue", "green", "yellow", "white"],
  },
  {
    rarity: "rare",
    weight: 25,
    label: "Rare",
    borderColor: "#4FC3F7",
    glowColor: "#81D4FA",
    capsuleColorBias: ["purple", "orange", "blue"],
  },
  {
    rarity: "ultra_rare",
    weight: 10,
    label: "Ultra Rare",
    borderColor: "#E040FB",
    glowColor: "#EA80FC",
    capsuleColorBias: ["purple", "pink"],
  },
  {
    rarity: "special",
    weight: 4,
    label: "Special",
    borderColor: "#00E5FF",
    glowColor: "#18FFFF",
    capsuleColorBias: ["black", "purple"],
  },
  {
    rarity: "legendary",
    weight: 1,
    label: "✦ Legendary 1-of-1",
    borderColor: "#D4AF37",
    glowColor: "#FFD700",
    capsuleColorBias: ["yellow", "black"],
  },
];
