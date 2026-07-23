// src/components/CapsuleTray.tsx
// Collection tray at the bottom of the machine — receives the capsule after drop.

import React from "react";
import { View, StyleSheet } from "react-native";
import { MachineThemeConfig } from "../models/MachineTheme";
import { CapsuleColor, CAPSULE_COLOR_HEX } from "../models/Capsule";

interface CapsuleTrayProps {
  theme: MachineThemeConfig;
  showCapsule: boolean;
  capsuleColor: CapsuleColor | null;
}

export default function CapsuleTray({ theme, showCapsule, capsuleColor }: CapsuleTrayProps) {
  const colorHex = capsuleColor ? CAPSULE_COLOR_HEX[capsuleColor] : "#FAFAFA";

  return (
    <View style={[styles.tray, { backgroundColor: theme.trayColor }]}>
      {showCapsule && capsuleColor && (
        <View style={styles.capsuleInTray}>
          <View style={[styles.trayCapsuleTop, { backgroundColor: colorHex }]}>
            <View style={styles.capsuleGloss} />
          </View>
          <View style={[styles.trayCapsuleBottom, { backgroundColor: colorHex }]} />
        </View>
      )}
      {/* Tray shadow/depth */}
      <View style={styles.trayShadow} />
    </View>
  );
}

const styles = StyleSheet.create({
  tray: {
    width: 260,
    height: 50,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: -4,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  capsuleInTray: {
    alignItems: "center",
    marginTop: -20,
  },
  trayCapsuleTop: {
    width: 44,
    height: 22,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: -1,
    overflow: "hidden",
  },
  trayCapsuleBottom: {
    width: 44,
    height: 22,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderTopWidth: 0,
  },
  capsuleGloss: {
    position: "absolute",
    top: 4,
    left: 8,
    right: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  trayShadow: {
    position: "absolute",
    bottom: -4,
    left: 20,
    right: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});
