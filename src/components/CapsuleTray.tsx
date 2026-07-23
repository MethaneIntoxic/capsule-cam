// src/components/CapsuleTray.tsx
// Collection tray at the bottom of the machine — receives the capsule after drop.

import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MachineThemeConfig } from "../models/MachineTheme";
import { CapsuleColor, CAPSULE_COLOR_HEX } from "../models/Capsule";

interface CapsuleTrayProps {
  theme: MachineThemeConfig;
  showCapsule: boolean;
  capsuleColor: CapsuleColor | null;
  onPressCapsule?: () => void;
}

export default function CapsuleTray({
  theme,
  showCapsule,
  capsuleColor,
  onPressCapsule,
}: CapsuleTrayProps) {
  const colorHex = capsuleColor ? CAPSULE_COLOR_HEX[capsuleColor] : "#FFD700";

  return (
    <View style={styles.trayContainer}>
      {/* Outlet Chute Lip */}
      <View style={styles.chuteLip}>
        <View style={styles.chuteDoor} />
      </View>

      {/* Main Tray Box */}
      <View style={[styles.tray, { backgroundColor: theme.trayColor }]}>
        <View style={styles.trayInnerRamp}>
          {showCapsule && capsuleColor ? (
            <TouchableOpacity
              onPress={onPressCapsule}
              activeOpacity={0.8}
              style={styles.capsuleInTray}
            >
              {/* Top Half */}
              <View style={[styles.trayCapsuleTop, { backgroundColor: colorHex }]}>
                <View style={styles.capsuleGloss} />
              </View>
              {/* Bottom Half */}
              <View style={[styles.trayCapsuleBottom, { backgroundColor: "#FFF" }]}>
                <Text style={styles.capsuleIconText}>✦</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <Text style={styles.trayLabel}>DISPENSE TRAY</Text>
          )}
        </View>
        <View style={styles.trayRim} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  trayContainer: {
    alignItems: "center",
    width: 270,
    marginTop: -8,
  },
  chuteLip: {
    width: 110,
    height: 16,
    backgroundColor: "#111",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 2,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  chuteDoor: {
    width: 80,
    height: 4,
    backgroundColor: "#222",
    borderRadius: 2,
  },
  tray: {
    width: 270,
    height: 70,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 3,
    borderColor: "#2B2D42",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    overflow: "hidden",
  },
  trayInnerRamp: {
    width: 230,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#0D0E15",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  trayLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#666",
  },
  capsuleInTray: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  trayCapsuleTop: {
    width: 52,
    height: 26,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
    borderBottomWidth: 0,
    overflow: "hidden",
  },
  trayCapsuleBottom: {
    width: 52,
    height: 26,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.2)",
    borderTopWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  capsuleIconText: {
    fontSize: 10,
    color: "#333",
    fontWeight: "900",
  },
  capsuleGloss: {
    position: "absolute",
    top: 4,
    left: 8,
    right: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  trayRim: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
});
