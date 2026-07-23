// src/screens/MachineScreen.tsx
// Gashapon machine main interaction screen.
// Shows the machine, handle, glass dome, and tray.
// Transitions through the animation state machine as user interacts.

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
import { GestureDetector } from "react-native-gesture-handler";
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
  const capsuleDropY = useSharedValue(-200);
  const capsuleOpacity = useSharedValue(0);

  // Load image on mount
  useEffect(() => {
    actions.loadImage();
  }, []);

  // Handle activation — create capsule and start shake
  const handleActivate = useCallback(async () => {
    haptics.activate();

    // Use the creation pipeline to resize, randomise, and persist
    const capsule = await creation.create(imageUri, caption);
    if (!capsule) {
      // Creation failed — still use inline fallback
      const { color, rarity } = randomCapsuleParams();
      const fallbackCapsule = createCapsule({
        imageUri,
        thumbnailUri: imageUri,
        caption: caption ?? null,
        capsuleColor: color,
        rarity,
      });
      actions.activate(fallbackCapsule);
      return;
    }

    actions.activate(capsule);
    await addCapsule(capsule);

    // Run shake animation
    machineShakeX.value = withTiming(6, { duration: 100 }, () => {
      machineShakeX.value = withTiming(-6, { duration: 100 }, () => {
        machineShakeX.value = withTiming(3, { duration: 100 }, () => {
          machineShakeX.value = withTiming(-3, { duration: 100 }, () => {
            machineShakeX.value = withTiming(0, { duration: 100 }, () => {
              runOnJS(actions.shakeComplete)();
            });
          });
        });
      });
    });

    // After shake, dispense
    setTimeout(() => {
      actions.dispenseComplete();
      capsuleOpacity.value = 1;
      capsuleDropY.value = withTiming(0, {
        duration: DURATIONS.DROP,
        easing: Easing.bezier(0.22, 0.61, 0.36, 1),
      }, () => {
        runOnJS(haptics.impact)();
        runOnJS(actions.dropComplete)();
      });
    }, DURATIONS.SHAKE + 200);
  }, [imageUri, caption, actions, haptics, creation, addCapsule, machineShakeX, capsuleDropY, capsuleOpacity]);

  // Handle rotation updates
  const handleRotationChange = useCallback((_degrees: number) => {
    actions.setRotation(_degrees);
  }, [actions]);

  // Handle haptic ticks during rotation
  const handleHapticTick = useCallback((_tick: number) => {
    haptics.tick();
  }, [haptics]);

  // Handle gesture
  const { gesture, handleStyle } = useHandleGesture({
    onActivate: handleActivate,
    onRotationChange: handleRotationChange,
    onHapticTick: handleHapticTick,
    enabled: state.phase === "ready" || state.phase === "turning",
  });

  // Handle opening
  const handleOpen = useCallback(() => {
    if (state.phase !== "landed") return;
    actions.startOpening();
    haptics.tick();

    setTimeout(() => {
      actions.openComplete();
      haptics.reveal();

      // Auto-save on reveal
      if (state.currentCapsule) {
        addCapsule(state.currentCapsule);
        actions.saveComplete();
      }
    }, DURATIONS.OPEN);
  }, [state.phase, state.currentCapsule, actions, haptics, addCapsule]);

  // Machine shake style
  const machineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: machineShakeX.value }],
  }));

  // Capsule drop style
  const dropStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: capsuleDropY.value }],
    opacity: capsuleOpacity.value,
  }));

  // Prompt text based on phase
  const promptText = () => {
    switch (state.phase) {
      case "ready":
        return "Turn the handle!";
      case "turning":
        return "Keep turning...";
      case "shaking":
        return "Shaking...";
      case "dispensing":
      case "dropping":
        return "A capsule is coming!";
      case "landed":
        return "Tap to open!";
      case "opening":
        return "Opening...";
      case "revealed":
        return "Your capsule is ready!";
      case "completed":
        return "Saved to collection!";
      default:
        return "";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 8 }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gashapon Machine</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Machine Area */}
        <View style={styles.machineArea}>
          <Animated.View style={machineStyle}>
            <GashaponMachine
              phase={state.phase}
              capsuleColor={state.currentCapsule?.capsuleColor ?? null}
              previewImageUri={imageUri}
              capsuleDropStyle={dropStyle}
            />
          </Animated.View>

          {/* Handle */}
          {(state.phase === "ready" || state.phase === "turning") && (
            <GestureDetector gesture={gesture}>
              <Animated.View style={[styles.handleContainer, handleStyle]}>
                <View style={styles.handleKnob} />
                <View style={styles.handleBar} />
              </Animated.View>
            </GestureDetector>
          )}

          {/* Tap to open area */}
          {(state.phase === "landed") && (
            <TouchableOpacity
              style={styles.openArea}
              onPress={handleOpen}
              activeOpacity={0.7}
            >
              <Text style={styles.openText}>👆 Tap to Open</Text>
            </TouchableOpacity>
          )}

          {/* Action buttons after reveal */}
          {(state.phase === "revealed" || state.phase === "completed") && (
            <View style={styles.postRevealActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push({
                  pathname: "/reveal",
                  params: { capsuleId: state.currentCapsule?.id }
                })}
              >
                <Text style={styles.actionButtonText}>💾 View Capsule</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryBtn]}
                onPress={() => {
                  actions.reset();
                  router.push("/capture");
                }}
              >
                <Text style={styles.actionButtonText}>🔄 Create Another</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>{promptText()}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A2E" },
  content: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  backBtn: { fontSize: 16, color: "#FFD700" },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#FFF" },
  machineArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  handleContainer: {
    position: "absolute",
    bottom: 140,
    right: 30,
    width: 60,
    height: 80,
    alignItems: "center",
    zIndex: 10,
  },
  handleKnob: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFD700",
    borderWidth: 3,
    borderColor: "#FFA000",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  handleBar: {
    width: 8,
    height: 40,
    backgroundColor: "#B0B0B0",
    borderRadius: 4,
  },
  openArea: {
    position: "absolute",
    bottom: 80,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: "rgba(255,215,0,0.2)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  openText: { fontSize: 18, fontWeight: "700", color: "#FFD700" },
  postRevealActions: {
    position: "absolute",
    bottom: 60,
    gap: 12,
    width: "100%",
    paddingHorizontal: 40,
  },
  actionButton: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#D32F2F",
    alignItems: "center",
  },
  secondaryBtn: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  actionButtonText: { fontSize: 16, fontWeight: "700", color: "#FFF" },
  promptContainer: {
    padding: 20,
    alignItems: "center",
  },
  promptText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFD700",
    textAlign: "center",
  },
});
