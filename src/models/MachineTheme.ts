// src/models/MachineTheme.ts
// Theme definitions for the gashapon machine appearance.

export interface MachineThemeConfig {
  id: string;
  name: string;
  bodyColor: string;
  bodyGradient: [string, string];
  accentColor: string;
  plateColor: string;
  glassColor: string;
  trayColor: string;
  backgroundGradient: [string, string];
  badgeText: string;
}

export const RETRO_ARCADE: MachineThemeConfig = {
  id: "retro_arcade",
  name: "Retro Arcade",
  bodyColor: "#E63946",
  bodyGradient: ["#FF4D5A", "#C1121F"],
  accentColor: "#FFB703",
  plateColor: "#2B2D42",
  glassColor: "rgba(255,255,255,0.22)",
  trayColor: "#1D1E2C",
  backgroundGradient: ["#0F0D15", "#1D182A"],
  badgeText: "GASHAPON ✦ 100¥",
};

export const CYBER_NEON: MachineThemeConfig = {
  id: "cyber_neon",
  name: "Cyber Neon",
  bodyColor: "#7209B7",
  bodyGradient: ["#B5179E", "#560BAD"],
  accentColor: "#4CC9F0",
  plateColor: "#10002B",
  glassColor: "rgba(76, 201, 240, 0.2)",
  trayColor: "#240046",
  backgroundGradient: ["#0A0612", "#19002E"],
  badgeText: "NEON ✦ CAPSULE",
};

export const PASTEL_Y2K: MachineThemeConfig = {
  id: "pastel_y2k",
  name: "Pastel Y2K",
  bodyColor: "#FFB5A7",
  bodyGradient: ["#FCD5CE", "#F8AD9D"],
  accentColor: "#F47174",
  plateColor: "#F9D6EC",
  glassColor: "rgba(255, 255, 255, 0.35)",
  trayColor: "#F8AD9D",
  backgroundGradient: ["#1C1625", "#2C1B38"],
  badgeText: "SWEET ✦ TOY",
};

export const CLASSIC_RED = RETRO_ARCADE;

export const THEMES: Record<string, MachineThemeConfig> = {
  retro_arcade: RETRO_ARCADE,
  cyber_neon: CYBER_NEON,
  pastel_y2k: PASTEL_Y2K,
};
