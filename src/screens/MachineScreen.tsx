// src/screens/MachineScreen.tsx
// High-end Industrial Gashapon Machine interaction screen.

import React, { useEffect, useCallback } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMachineContext } from "../state/MachineContext";
import { useHandleGesture } from "../hooks/useHandleGesture";
import { useHaptics } from "../hooks/useHaptics";
import { useSound } from "../hooks/useSound";
import { useAndroidBackHandler } from "../hooks/useAndroidBackHandler";
import { useCapsuleCreation } from "../hooks/useCapsuleCreation";
import { useCollectionContext } from "../state/CollectionContext";
import { randomCapsuleParams } from "../utils/randomiser";
import { createCapsule } from "../models/Capsule";
import GashaponMachine from "../components/GashaponMachine";
import BottomTabBar from "../components/BottomTabBar";

import { FilmFilterId } from "../models/FilmFilter";

interface MachineScreenProps {
  imageUri: string;
  caption?: string;
  filmFilter?: string;
}

export default function MachineScreen({ imageUri, caption, filmFilter }: MachineScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, actions } = useMachineContext();
  const haptics = useHaptics();
  const sound = useSound();
  const creation = useCapsuleCreation();
  const { addCapsule } = useCollectionContext();

  // Animated values for machine visuals
  const machineShakeX = useSharedValue(0);
  const capsuleDropY = useSharedValue(0);
  const capsuleOpacity = useSharedValue(0);

  // Load image on mount
  useEffect(() => {
    actions.loadImage();
  }, []);

  // Handle activation — 1.5 seconds intense shake, then dispense into tray
  const handleActivate = useCallback(() => {
    haptics.heavyLock();
    haptics.startRumble();
    sound.play("handleClick");
    sound.play("capsuleRattle");

    // 1. Build immediate capsule object so state transitions instantly to shaking
    const filterParam = (filmFilter && filmFilter !== "random" ? filmFilter : undefined) as FilmFilterId | undefined;
    const { color, rarity, filmFilter: chosenFilter } = randomCapsuleParams({
      filmFilter: filterParam,
    });
    const immediateCapsule = createCapsule({
      imageUri,
      thumbnailUri: imageUri,
      caption: caption ?? null,
      capsuleColor: color,
      rarity,
      filmFilter: chosenFilter,
    });

    actions.activate(immediateCapsule);
    addCapsule(immediateCapsule);

    // Save in storage asynchronously in background
    creation.create(imageUri, caption).then((saved) => {
      if (saved) addCapsule(saved);
    });

    // 2. Machine shake visual animation using withSequence — 100% stack-safe & smooth
    machineShakeX.value = withSequence(
      withTiming(16, { duration: 100 }),
      withTiming(-16, { duration: 100 }),
      withTiming(14, { duration: 100 }),
      withTiming(-14, { duration: 100 }),
      withTiming(12, { duration: 100 }),
      withTiming(-12, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(-10, { duration: 100 }),
      withTiming(6, { duration: 100 }),
      withTiming(-6, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );

    // 3. Step 1: Complete shaking after 1.5s -> Dispensing phase (t = 1500ms)
    setTimeout(() => {
      actions.shakeComplete();
      sound.play("capsuleDrop");
    }, 1500);

    // 4. Step 2: Complete dispensing -> Dropping phase & drop capsule into tray (t = 1800ms)
    setTimeout(() => {
      actions.dispenseComplete();
      capsuleOpacity.value = 1;
      capsuleDropY.value = withTiming(140, {
        duration: 600,
        easing: Easing.bounce,
      });
    }, 1800);

    // 5. Step 3: Complete drop -> Landed phase in tray (t = 2450ms)
    setTimeout(() => {
      haptics.impact();
      sound.play("trayImpact");
      capsuleOpacity.value = 0;
      actions.dropComplete();
    }, 2450);
  }, [imageUri, caption, actions, haptics, sound, creation, addCapsule, machineShakeX, capsuleDropY, capsuleOpacity]);

  const handleRotationChange = useCallback(
    (_degrees: number) => {
      actions.setRotation(_degrees);
    },
    [actions]
  );

  const handleHapticTick = useCallback(
    (_tick: number) => {
      haptics.tick();
      sound.play("handleClick");
    },
    [haptics, sound]
  );

  const { gesture, handleStyle, triggerFullTurn } = useHandleGesture({
    onActivate: handleActivate,
    onRotationChange: handleRotationChange,
    onHapticTick: handleHapticTick,
    enabled: state.phase === "ready" || state.phase === "turning",
  });

  const handleOpen = useCallback(() => {
    if (state.phase !== "landed") return;
    haptics.selection();
    sound.play("capsuleOpen");
    if (state.currentCapsule) {
      addCapsule(state.currentCapsule);
      router.push({
        pathname: "/reveal",
        params: { capsuleId: state.currentCapsule.id },
      });
    }
  }, [state.phase, state.currentCapsule, haptics, sound, addCapsule, router]);

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
        return "CRANK THE KNOB 360° OR PRESS BELOW ✦";
      case "turning":
        return "MECHANICAL ROTATION ACTIVE... ↺";
      case "shaking":
        return "✦ GASHAPON DISPENSER RUMBLING ✦";
      case "dispensing":
      case "dropping":
        return "DISPENSING CAPSULE TO TRAY... 💊";
      case "landed":
        return "TAP CAPSULE IN TRAY TO UNBOX ✦";
      case "opening":
        return "UNBOXING CAPSULE... ✨";
      case "revealed":
      case "completed":
        return "CAPSULE SECURED IN BINDER ✦";
      default:
        return "";
    }
  };

  const handleAndroidBack = useCallback(() => {
    actions.reset();
    router.replace("/");
    return true;
  }, [actions, router]);

  useAndroidBackHandler(handleAndroidBack);

  const topInset = Math.max(insets.top, Platform.OS === "ios" ? 44 : 24);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: topInset + 8, paddingBottom: 110 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              haptics.selection();
              actions.reset();
              router.replace("/");
            }}
          >
            <Text style={styles.backBtnText}>← VIEWFINDER</Text>
          </TouchableOpacity>
          <View style={styles.titleBadge}>
            <Text style={styles.headerTitle}>GASHAPON UNIT 01</Text>
          </View>
          <View style={{ width: 70 }} />
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
              onTurnClick={() => {
                haptics.heavyLock();
                haptics.startRumble();
                triggerFullTurn();
              }}
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
              onPressIn={() => {
                haptics.heavyLock();
                haptics.startRumble();
              }}
              onPress={() => {
                triggerFullTurn();
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.crankBtnText}>↻ CRANK KNOB (360°)</Text>
            </TouchableOpacity>
          )}

          {state.phase === "landed" && (
            <TouchableOpacity
              style={styles.openBtn}
              onPressIn={() => {
                haptics.selection();
              }}
              onPress={() => {
                handleOpen();
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.openBtnText}>✦ UNBOX CAPSULE NOW</Text>
            </TouchableOpacity>
          )}

          {(state.phase === "revealed" || state.phase === "completed") && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtnPrimary}
                onPress={() => {
                  haptics.selection();
                  router.push({
                    pathname: "/reveal",
                    params: { capsuleId: state.currentCapsule?.id },
                  });
                }}
              >
                <Text style={styles.actionBtnText}>◈ VIEW PHOTO CARD</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtnSecondary}
                onPress={() => {
                  haptics.selection();
                  actions.reset();
                  router.push("/");
                }}
              >
                <Text style={styles.actionBtnText}>📸 ANOTHER CAPSULE</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Tab Navigation */}
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0E12", overflow: "hidden" },
  content: { flexGrow: 1, paddingHorizontal: 16, paddingBottom: 110 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  backBtnText: { fontSize: 11, fontWeight: "900", color: "#D4AF37", letterSpacing: 1.5 },
  titleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#16161C",
    borderWidth: 1.5,
    borderColor: "#D4AF37",
  },
  headerTitle: { fontSize: 13, fontWeight: "900", color: "#E2DFD7", letterSpacing: 2 },
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
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#16161C",
    borderWidth: 1.5,
    borderColor: "#D4AF37",
    width: "100%",
    alignItems: "center",
  },
  promptText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#D4AF37",
    textAlign: "center",
    letterSpacing: 1.5,
  },
  crankBtn: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: "#C8372D",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#D4AF37",
    shadowColor: "#C8372D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  crankBtnText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1.5,
  },
  openBtn: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: "#D4AF37",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  openBtnText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0E0E12",
    letterSpacing: 1.5,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  actionBtnPrimary: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#C8372D",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#D4AF37",
  },
  actionBtnSecondary: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#16161C",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.15)",
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 1,
  },
});

