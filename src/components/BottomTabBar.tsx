// src/components/BottomTabBar.tsx
// High-End Floating Industrial Bottom Navigation Bar.

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHaptics } from "../hooks/useHaptics";
import { useSound } from "../hooks/useSound";

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const sound = useSound();

  const bottomInset = Math.max(insets.bottom, Platform.OS === "android" ? 16 : 10);

  const tabs = [
    { id: "viewfinder", path: "/", label: "VIEWFINDER", icon: "📸" },
    { id: "machine", path: "/machine", label: "GASHAPON", icon: "🎰" },
    { id: "binder", path: "/collection", label: "BINDER", icon: "📦" },
    { id: "studio", path: "/studio", label: "STUDIO", icon: "🏠" },
  ];

  const handleNavigate = (path: string) => {
    if (pathname === path) return;
    haptics.selection();
    sound.play("handleClick");
    router.replace(path as any);
  };

  return (
    <View style={[styles.container, { paddingBottom: bottomInset }]}>
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || (tab.path !== "/" && pathname.startsWith(tab.path));
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => handleNavigate(tab.path)}
              activeOpacity={0.8}
            >
              <Text style={styles.icon}>{tab.icon}</Text>
              <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 1000,
    pointerEvents: "box-none",
  },
  bar: {
    flexDirection: "row",
    backgroundColor: "#13141A",
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: "#D4AF37",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    width: "100%",
    maxWidth: 380,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    borderRadius: 16,
    position: "relative",
  },
  activeTab: {
    backgroundColor: "rgba(212, 175, 55, 0.12)",
  },
  icon: {
    fontSize: 16,
    marginBottom: 2,
  },
  label: {
    fontSize: 9,
    fontWeight: "900",
    color: "#888890",
    letterSpacing: 1,
  },
  activeLabel: {
    color: "#D4AF37",
  },
  activeDot: {
    position: "absolute",
    top: 4,
    right: 18,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#D4AF37",
  },
});
