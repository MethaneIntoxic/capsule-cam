// src/models/FilmFilter.ts
// Analog Film Filter definitions and randomizer weights.

export type FilmFilterId =
  | "kodachrome"
  | "superia"
  | "cinestill"
  | "noir"
  | "portra"
  | "expired"
  | "prism";

export interface FilmFilterConfig {
  id: FilmFilterId;
  name: string;
  badge: string;
  overlayColor: string;
  tintOpacity: number;
  contrast: number;
  saturate: number;
  sepia: number;
  rarityWeight: number; // 0-100
}

export const FILM_FILTERS: Record<FilmFilterId, FilmFilterConfig> = {
  kodachrome: {
    id: "kodachrome",
    name: "KODACHROME '74",
    badge: "🎞️ KODA 74",
    overlayColor: "rgba(230, 161, 92, 0.22)",
    tintOpacity: 0.22,
    contrast: 1.15,
    saturate: 1.25,
    sepia: 0.35,
    rarityWeight: 30,
  },
  superia: {
    id: "superia",
    name: "FUJI SUPERIA 200",
    badge: "🟢 FUJI 200",
    overlayColor: "rgba(69, 182, 156, 0.18)",
    tintOpacity: 0.18,
    contrast: 1.1,
    saturate: 1.3,
    sepia: 0.0,
    rarityWeight: 25,
  },
  cinestill: {
    id: "cinestill",
    name: "CINESTILL 800T",
    badge: "🔵 CINE 800T",
    overlayColor: "rgba(43, 144, 217, 0.22)",
    tintOpacity: 0.22,
    contrast: 1.2,
    saturate: 1.1,
    sepia: 0.0,
    rarityWeight: 20,
  },
  noir: {
    id: "noir",
    name: "MONOCHROME NOIR HP5",
    badge: "⚫ ILFORD HP5",
    overlayColor: "rgba(0, 0, 0, 0.45)",
    tintOpacity: 0.45,
    contrast: 1.35,
    saturate: 0.0,
    sepia: 0.0,
    rarityWeight: 15,
  },
  portra: {
    id: "portra",
    name: "KODAK PORTRA 400",
    badge: "🟡 PORTRA 400",
    overlayColor: "rgba(247, 197, 159, 0.2)",
    tintOpacity: 0.2,
    contrast: 1.05,
    saturate: 1.15,
    sepia: 0.15,
    rarityWeight: 25,
  },
  expired: {
    id: "expired",
    name: "EXPIRED 1998 FILM",
    badge: "⚠️ EXPIRED 98",
    overlayColor: "rgba(28, 124, 84, 0.25)",
    tintOpacity: 0.25,
    contrast: 0.95,
    saturate: 0.85,
    sepia: 0.4,
    rarityWeight: 10,
  },
  prism: {
    id: "prism",
    name: "✦ HOLOGRAPHIC PRISM",
    badge: "✦ PRISM 1-OF-1",
    overlayColor: "rgba(224, 64, 251, 0.25)",
    tintOpacity: 0.25,
    contrast: 1.3,
    saturate: 1.6,
    sepia: 0.0,
    rarityWeight: 5,
  },
};

export function pickRandomFilmFilter(): FilmFilterId {
  const keys = Object.keys(FILM_FILTERS) as FilmFilterId[];
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (const key of keys) {
    cumulative += FILM_FILTERS[key].rarityWeight;
    if (roll <= cumulative) return key;
  }
  return "kodachrome";
}
