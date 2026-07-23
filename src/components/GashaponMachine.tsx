// src/components/GashaponMachine.tsx
// Main machine body — composed of glass dome, capsule compartment, and tray.

import React from "react";
import { View, StyleSheet, Image } from "react-native";
import Animated, { type AnimatedStyle } from "react-native-reanimated";
import type { ViewStyle } from "react-native";
import { MachinePhase } from "../hooks/useCapsuleMachine";
import { CapsuleColor, CAPSULE_COLOR_HEX } from "../models/Capsule";
import { CLASSIC_RED } from "../models/MachineTheme";
import CapsuleTray from "./CapsuleTray";

interface GashaponMachineProps {
  phase: MachinePhase;
  capsuleColor: CapsuleColor | null;
  previewImageUri: string;
  capsuleDropStyle: AnimatedStyle<ViewStyle>;
}

export default function GashaponMachine({
  phase,
  capsuleColor,
  previewImageUri,
  capsuleDropStyle,
}: GashaponMachineProps) {
  const theme = CLASSIC_RED;
  const colorHex = capsuleColor ? CAPSULE_COLOR_HEX[capsuleColor] : "#FAFAFA";

  const showPreview = phase !== "idle";
  const showLandedCapsule = phase === "landed" || phase === "opening" || phase === "revealed" || phase === "completed";

  return (
    <View style={styles.container}>
      {/* Machine Body */}
      <View style={[styles.machineBody, { backgroundColor: theme.bodyColor }]}>
        {/* Glass Dome */}
        <View style={[styles.glassDome, { backgroundColor: theme.glassColor }]}>
          {showPreview && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: previewImageUri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            </View>
          )}

          {/* Capsule inside dome (during dispense) */}
          {(phase === "dispensing" || phase === "dropping") && capsuleColor && (
            <Animated.View
              style={[
                styles.dispensingCapsule,
                { backgroundColor: colorHex },
                capsuleDropStyle,
              ]}
            >
              <View style={styles.capsuleGloss} />
            </Animated.View>
          )}
        </View>

        {/* Machine details */}
        <View style={styles.machineDetails}>
          <View style={[styles.detailStripe, { backgroundColor: theme.accentColor }]} />
        </View>

        {/* Machine outlet */}
        <View style={styles.outlet} />
      </View>

      {/* Capsule Tray */}
      <CapsuleTray
        theme={theme}
        showCapsule={showLandedCapsule}
        capsuleColor={capsuleColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 280,
  },
  machineBody: {
    width: 260,
    height: 340,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  glassDome: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },
  previewContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  dispensingCapsule: {
    position: "absolute",
    bottom: 20,
    width: 60,
    height: 80,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
  },
  capsuleGloss: {
    position: "absolute",
    top: 10,
    left: 12,
    right: 12,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  machineDetails: {
    marginTop: 8,
    width: "100%",
    paddingHorizontal: 20,
  },
  detailStripe: {
    height: 4,
    borderRadius: 2,
    opacity: 0.6,
  },
  outlet: {
    width: 60,
    height: 12,
    backgroundColor: "#222",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginTop: 8,
  },
});
