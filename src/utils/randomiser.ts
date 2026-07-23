// src/utils/randomiser.ts
// Weighted random selection for capsule rarity and colour.

import { CapsuleColor, Rarity } from "../models/Capsule";
import { RARITY_TABLE } from "../models/Rarity";

const CAPSULE_COLORS: CapsuleColor[] = [
  "pink", "blue", "green", "yellow", "purple", "orange", "white", "black",
];

interface RandomCapsuleParams {
  color?: CapsuleColor;
  rarity?: Rarity;
}

export function randomCapsuleParams(
  params?: RandomCapsuleParams
): { color: CapsuleColor; rarity: Rarity } {
  const rarity = params?.rarity ?? pickRarity();
  const color = params?.color ?? pickColor(rarity);
  return { color, rarity };
}

function pickRarity(): Rarity {
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (const entry of RARITY_TABLE) {
    cumulative += entry.weight;
    if (roll < cumulative) return entry.rarity;
  }
  return "common";
}

function pickColor(forRarity: Rarity): CapsuleColor {
  const config = RARITY_TABLE.find((r) => r.rarity === forRarity);
  const pool = (config?.capsuleColorBias as CapsuleColor[]) ?? CAPSULE_COLORS;
  return pool[Math.floor(Math.random() * pool.length)]!;
}
