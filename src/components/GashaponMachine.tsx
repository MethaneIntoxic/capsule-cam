// src/components/GashaponMachine.tsx
// Main machine body — composed of glass dome, coin panel, crank handle, and tray.

import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, { type AnimatedStyle } from "react-native-reanimated";
import type { ViewStyle } from "react-native";
import { GestureDetector, type GestureType, type ComposedGesture } from "react-native-gesture-handler";
import { MachinePhase } from "../hooks/useCapsuleMachine";
import { CapsuleColor, CAPSULE_COLOR_HEX } from "../models/Capsule";
import { RETRO_ARCADE } from "../models/MachineTheme";
import MachineGlass from "./MachineGlass";
import CapsuleTray from "./CapsuleTray";

interface GashaponMachineProps {
  phase: MachinePhase;
  capsuleColor: CapsuleColor | null;
  previewImageUri?: string;
  capsuleDropStyle: AnimatedStyle<ViewStyle>;
  handleStyle?: AnimatedStyle<ViewStyle>;
  gesture?: GestureType | ComposedGesture;
  onTurnClick?: () => void;
  onOpenClick?: () => void;
}

export default function GashaponMachine({
  phase,
  capsuleColor,
  previewImageUri,
  capsuleDropStyle,
  handleStyle,
  gesture,
  onTurnClick,
  onOpenClick,
}: GashaponMachineProps) {
  const theme = RETRO_ARCADE;
  const colorHex = capsuleColor ? CAPSULE_COLOR_HEX[capsuleColor] : "#FFD700";

  const showPreview = phase !== "idle";
  const showLandedCapsule =
    phase === "landed" ||
    phase === "opening" ||
    phase === "revealed" ||
    phase === "completed";

  const canTurn = phase === "ready" || phase === "turning";

  const statusText = () => {
    switch (phase) {
      case "idle":
        return "LOAD PHOTO";
      case "ready":
      case "turning":
        return "READY ✦ CRANK";
      case "shaking":
        return "SHAKING...";
      case "dispensing":
      case "dropping":
        return "DISPENSING...";
      case "landed":
        return "OPEN CAPSULE!";
      default:
        return "COLLECTED!";
    }
  };

  return (
    <View style={styles.container}>
      {/* Outer Machine Housing */}
      <View style={styles.machineFrame}>
        {/* Top Dome Area */}
        <View style={styles.domeHeader}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandTitle}>CAPSULE CAM</Text>
            <Text style={styles.brandSub}>SUPER GASHAPON ✦ 90S EDITION</Text>
          </View>
          <MachineGlass
            theme={theme}
            imageUri={previewImageUri}
            isVisible={showPreview}
          />
        </View>

        {/* Lower Main Body & Control Panel */}
        <View style={styles.bodySection}>
          {/* Status Indicator LED */}
          <View style={styles.statusPanel}>
            <View
              style={[
                styles.statusLed,
                canTurn && styles.statusLedActive,
                (phase === "shaking" || phase === "dispensing") && styles.statusLedShaking,
              ]}
            />
            <Text style={styles.statusText}>{statusText()}</Text>
          </View>

          {/* Coin Mechanism Plate */}
          <View style={styles.coinPlate}>
            <View style={styles.coinSlotRow}>
              <View style={styles.coinSlot}>
                <View style={styles.coinSlotHole} />
              </View>
              <Text style={styles.coinText}>1 PHOTO = 1 CAPSULE</Text>
            </View>

            {/* Centered Crank Handle Mechanism */}
            <View style={styles.crankArea}>
              <View style={styles.crankRing}>
                <Text style={styles.crankRingText}>ROTATE ↻ 360°</Text>
                <View style={[styles.notch, styles.notchTop]} />
                <View style={[styles.notch, styles.notchRight]} />
                <View style={[styles.notch, styles.notchBottom]} />
                <View style={[styles.notch, styles.notchLeft]} />
              </View>

              {gesture && canTurn ? (
                <GestureDetector gesture={gesture}>
                  <Animated.View style={[styles.crankTouchTarget, styles.tBarHandle, handleStyle]}>
                    <View style={styles.tBarCapLeft} />
                    <View style={styles.tBarCenterBadge}>
                      <Text style={styles.tBarStar}>✦</Text>
                    </View>
                    <View style={styles.tBarCapRight} />
                  </Animated.View>
                </GestureDetector>
              ) : (
                <Animated.View style={[styles.crankTouchTarget, styles.tBarHandle, handleStyle]}>
                  <View style={styles.tBarCapLeft} />
                  <View style={styles.tBarCenterBadge}>
                    <Text style={styles.tBarStar}>✦</Text>
                  </View>
                  <View style={styles.tBarCapRight} />
                </Animated.View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Dispensing Chute Capsule Fall Layer */}
      {(phase === "dispensing" || phase === "dropping") && capsuleColor && (
        <Animated.View
          style={[
            styles.fallingCapsule,
            { backgroundColor: colorHex },
            capsuleDropStyle,
          ]}
        >
          <View style={styles.capsuleTopHalf} />
          <View style={styles.capsuleGloss} />
        </Animated.View>
      )}

      {/* Capsule Tray */}
      <CapsuleTray
        theme={theme}
        showCapsule={showLandedCapsule}
        capsuleColor={capsuleColor}
        onPressCapsule={onOpenClick}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 300,
    position: "relative",
  },
  machineFrame: {
    width: 290,
    backgroundColor: "#1B1C22",
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#D4AF37",
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 16,
  },
  domeHeader: {
    alignItems: "center",
    marginBottom: 8,
  },
  brandBadge: {
    backgroundColor: "#0E0E12",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#D4AF37",
    marginBottom: 10,
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#D4AF37",
    letterSpacing: 2.5,
  },
  brandSub: {
    fontSize: 8,
    fontWeight: "800",
    color: "#A0A0A8",
    letterSpacing: 1.5,
  },
  bodySection: {
    width: "100%",
    backgroundColor: "#121318",
    borderRadius: 22,
    padding: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(212, 175, 55, 0.4)",
  },
  statusPanel: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#08080C",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
    marginBottom: 12,
    gap: 8,
  },
  statusLed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#444",
  },
  statusLedActive: {
    backgroundColor: "#00E5FF",
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  statusLedShaking: {
    backgroundColor: "#C8372D",
    shadowColor: "#C8372D",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#D4AF37",
    letterSpacing: 1.5,
  },
  coinPlate: {
    width: "100%",
    backgroundColor: "#1A1B22",
    borderRadius: 18,
    padding: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  coinSlotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  coinSlot: {
    width: 32,
    height: 16,
    backgroundColor: "#0A0A0E",
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#D4AF37",
    justifyContent: "center",
    alignItems: "center",
  },
  coinSlotHole: {
    width: 16,
    height: 2.5,
    backgroundColor: "#000",
  },
  coinText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#E2DFD7",
    letterSpacing: 1.5,
  },
  crankArea: {
    width: 130,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  crankRing: {
    position: "absolute",
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 2,
    borderColor: "#D4AF37",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  crankRingText: {
    position: "absolute",
    top: 4,
    fontSize: 7.5,
    fontWeight: "900",
    color: "#D4AF37",
    letterSpacing: 1.5,
  },
  notch: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#D4AF37",
  },
  notchTop: { top: 2 },
  notchRight: { right: 2 },
  notchBottom: { bottom: 2 },
  notchLeft: { left: 2 },
  crankTouchTarget: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  tBarHandle: {
    width: 90,
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tBarCapLeft: {
    width: 30,
    height: 22,
    backgroundColor: "#3A3B45",
    borderTopLeftRadius: 11,
    borderBottomLeftRadius: 11,
    borderWidth: 1.5,
    borderColor: "#D4AF37",
  },
  tBarCenterBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D4AF37",
    borderWidth: 2,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  tBarStar: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0E0E12",
  },
  tBarCapRight: {
    width: 30,
    height: 22,
    backgroundColor: "#3A3B45",
    borderTopRightRadius: 11,
    borderBottomRightRadius: 11,
    borderWidth: 1.5,
    borderColor: "#D4AF37",
  },
  fallingCapsule: {
    position: "absolute",
    top: 140,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#FFF",
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  capsuleTopHalf: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  capsuleGloss: {
    position: "absolute",
    top: 5,
    left: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
});
