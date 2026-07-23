// src/models/Capsule.ts
// Core type definitions and factory for the Capsule entity.

import { generateUUID } from "../utils/uuid";

export type CapsuleId = string;
export type ISODateString = string;

export type CapsuleColor =
  | "pink"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "orange"
  | "white"
  | "black";

export type Rarity = "common" | "rare" | "special";

export type MachineTheme =
  | "classic_red"
  | "pastel"
  | "transparent_future"
  | "convenience_store"
  | "arcade";

export interface Capsule {
  id: CapsuleId;
  createdAt: ISODateString;
  imageUri: string;
  thumbnailUri: string;
  caption: string | null;
  capsuleColor: CapsuleColor;
  machineTheme: MachineTheme;
  rarity: Rarity;
  isOpened: boolean;
  openedAt: ISODateString | null;
}

// Factory — ensures every capsule has sensible defaults
export function createCapsule(partial: Partial<Capsule> & { imageUri: string; thumbnailUri: string }): Capsule {
  const now = new Date().toISOString();
  return {
    id: partial.id ?? generateUUID(),
    createdAt: partial.createdAt ?? now,
    imageUri: partial.imageUri,
    thumbnailUri: partial.thumbnailUri,
    caption: partial.caption ?? null,
    capsuleColor: partial.capsuleColor ?? "white",
    machineTheme: partial.machineTheme ?? "classic_red",
    rarity: partial.rarity ?? "common",
    isOpened: partial.isOpened ?? false,
    openedAt: partial.openedAt ?? null,
  };
}

// Colour-to-hex map for rendering capsules
export const CAPSULE_COLOR_HEX: Record<CapsuleColor, string> = {
  pink: "#F48FB1",
  blue: "#64B5F6",
  green: "#81C784",
  yellow: "#FFF176",
  purple: "#CE93D8",
  orange: "#FFB74D",
  white: "#FAFAFA",
  black: "#424242",
};
