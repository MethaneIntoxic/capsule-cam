// src/screens/MachineScreen.tsx
// Gashapon machine main interaction screen.

import React, { useEffect, useCallback } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMachineContext } from "../state/MachineContext";
import { useHandleGesture } from "../hooks/useHandleGesture";
import { useHaptics } from "../hooks/useHaptics";
import { useCapsuleCreation } from "../hooks/useCapsuleCreation";
import { useCollectionContext } from "../state/CollectionContext";
import { randomCapsuleParams } from "../utils/randomiser";
import { createCapsule } from "../models/Capsule";
import GashaponMachine from "../components/GashaponMachine";
import { DURATIONS } from "../animations/machineAnimations";

interface MachineScreenProps {
  imageUri: string;
  caption?: string;
}

export default function MachineScreen({ imageUri, caption }: MachineScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, actions } = useMachineContext();
  const haptics = useHaptics();
  const creation = useCapsuleCreation();
  const { addCapsule } = useCollectionContext();

  // Animated values for machine visuals
  const machineShakeX = useSharedValue(0);
  const capsuleDropY = useSharedValue(-180);
  const capsuleOpacity = useSharedValue(0);

  // Load image on mount
  useEffect(() => {
    actions.loadImage();
  }, []);

  // Handle activation — create capsule and start shake
  const handleActivate = useCallback(async () => {
    haptics.activate();

    // Use creation pipeline
    const capsule = await creation.create(imageUri, caption);
    if (!capsule) {
      const { color, rarity } = randomCapsuleParams();
      const fallbackCapsule = createCapsule({
        imageUri,
        thumbnailUri: imageUri,
        caption: caption ?? null,
        capsuleColor: color,
        rarity,
      });
      actions.activate(fallbackCapsule);
    } else {
      actions.activate(capsule);
      await addCapsule(capsule);
    }

    // Run intense machine shake animation
    machineShakeX.value = withTiming(10, { duration: 80 }, () => {
      machineShakeX.value = withTiming(-10, { duration: 80 }, () => {
        machineShakeX.value = withTiming(8, { duration: 80 }, () => {
          machineShakeX.value = withTiming(-8, { duration: 80 }, () => {
            machineShakeX.value = withTiming(4, { duration: 80 }, () => {
              machineShakeX.value = withTiming(0, { duration: 80 }, () => {
                runOnJS(actions.shakeComplete)();
              });
            });
          });
        });
      });
    });

    // After shake, dispense capsule into tray
    setTimeout(() => {
      actions.dispenseComplete();
      capsuleOpacity.value = 1;
      capsuleDropY.value = withTiming(
        150,
        {
          duration: DURATIONS.DROP,
          easing: Easing.bounce,
        },
        () => {
          runOnJS(haptics.impact)();
          runOnJS(actions.dropComplete)();
        }
      );
    }, DURATIONS.SHAKE + 100);
  }, [imageUri, caption, actions, haptics, creation, addCapsule, machineShakeX, capsuleDropY, capsuleOpacity]);

  const handleRotationChange = useCallback(
    (_degrees: number) => {
      actions.setRotation(_degrees);
    },
    [actions]
  );

  const handleHapticTick = useCallback(
    (_tick: number) => {
      haptics.tick();
    },
    [haptics]
  );

  const { gesture, handleStyle, triggerFullTurn } = useHandleGesture({
    onActivate: handleActivate,
    onRotationChange: handleRotationChange,
    onHapticTick: handleHapticTick,
    enabled: state.phase === "ready" || state.phase === "turning",
  });

  const handleOpen = useCallback(() => {
    if (state.phase !== "landed") return;
    actions.startOpening();
    haptics.tick();

    setTimeout(() => {
      actions.openComplete();
      haptics.reveal();

      if (state.currentCapsule) {
        addCapsule(state.currentCapsule);
        actions.saveComplete();
      }
    }, DURATIONS.OPEN);
  }, [state.phase, state.currentCapsule, actions, haptics, addCapsule]);

  const machineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: machineShakeX.value }],
  }));

  const dropStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: capsuleDropY.value }],
    opacity: capsuleOpacity.value,
  }));

  const promptText = () => {
    switch (state.phase) {
      case "ready":
        return "Crank the knob or tap TURN to dispense! ↻";
      case "turning":
        return "Keep turning the knob! ↺";
      case "shaking":
        return "✦ GASHAPON MECHANISM ACTIVE ✦";
      case "dispensing":
      case "dropping":
        return "Capsule rolling down chute! 💊";
      case "landed":
        return "Tap capsule in tray to open! ✨";
      case "opening":
        return "Unboxing your capsule... ✦";
      case "revealed":
      case "completed":
        return "Capsule collected! 🎉";
      default:
        return "";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 8 }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              actions.reset();
              router.back();
            }}
          >
            <Text style={styles.backBtnText}>← BACK</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SUPER GASHAPON</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Machine Area */}
        <View style={styles.machineArea}>
          <Animated.View style={machineStyle}>
            <GashaponMachine
              phase={state.phase}
              capsuleColor={state.currentCapsule?.capsuleColor ?? null}
              previewImageUri={imageUri}
              capsuleDropStyle={dropStyle}
              handleStyle={handleStyle}
              gesture={gesture}
              onTurnClick={triggerFullTurn}
              onOpenClick={handleOpen}
            />
          </Animated.View>
        </View>

        {/* Controls & Prompts */}
        <View style={styles.controlArea}>
          <View style={styles.promptBanner}>
            <Text style={styles.promptText}>{promptText()}</Text>
          </View>

          {(state.phase === "ready" || state.phase === "turning") && (
            <TouchableOpacity
              style={styles.crankBtn}
              onPress={triggerFullTurn}
              activeOpacity={0.8}
            >
              <Text style={styles.crankBtnText}>↻ CRANK KNOB (360°)</Text>
            </TouchableOpacity>
          )}

          {state.phase === "landed" && (
            <TouchableOpacity
              style={styles.openBtn}
              onPress={handleOpen}
              activeOpacity={0.8}
            >
              <Text style={styles.openBtnText}>✨ UNBOX CAPSULE NOW</Text>
            </TouchableOpacity>
          )}

          {(state.phase === "revealed" || state.phase === "completed") && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtnPrimary}
                onPress={() =>
                  router.push({
                    pathname: "/reveal",
                    params: { capsuleId: state.currentCapsule?.id },
                  })
                }
              >
                <Text style={styles.actionBtnText}>🖼️ VIEW PHOTO CARD</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtnSecondary}
                onPress={() => {
                  actions.reset();
                  router.push("/capture");
                }}
              >
                <Text style={styles.actionBtnText}>📸 ANOTHER CAPSULE</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0D15" },
  content: { flex: 1, paddingHorizontal: 16, paddingBottom: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  backBtnText: { fontSize: 12, fontWeight: "800", color: "#FFB703" },
  headerTitle: { fontSize: 16, fontWeight: "900", color: "#FFF", letterSpacing: 2 },
  machineArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  controlArea: {
    alignItems: "center",
    gap: 12,
    paddingBottom: 8,
  },
  promptBanner: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#1A1B28",
    borderWidth: 2,
    borderColor: "#FFB703",
    width: "100%",
    alignItems: "center",
  },
  promptText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFB703",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  crankBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "#FFB703",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
    shadowColor: "#FFB703",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  crankBtnText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111",
    letterSpacing: 1,
  },
  openBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "#00E5FF",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  openBtnText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  actionBtnPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#E63946",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFB703",
  },
  actionBtnSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#2B2D42",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 0.5,
  },
});
