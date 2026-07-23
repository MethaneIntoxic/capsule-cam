// src/models/MachineTheme.ts
// Theme definitions for the gashapon machine appearance.
// Only one theme (Classic Red) is needed for MVP.

export interface MachineThemeConfig {
  id: string;
  name: string;
  bodyColor: string;
  accentColor: string;
  glassColor: string;
  trayColor: string;
  backgroundGradient: [string, string];
  bodyImage?: string;
}

export const CLASSIC_RED: MachineThemeConfig = {
  id: "classic_red",
  name: "Classic Red",
  bodyColor: "#D32F2F",
  accentColor: "#FFD700",
  glassColor: "rgba(255,255,255,0.25)",
  trayColor: "#424242",
  backgroundGradient: ["#1A1A2E", "#16213E"],
};

export const THEMES: Record<string, MachineThemeConfig> = {
  classic_red: CLASSIC_RED,
};
