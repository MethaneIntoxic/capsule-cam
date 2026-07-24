// src/screens/RevealScreen.tsx
// High-End Capsule Reveal — Spring-loaded unboxing and foil photo card presentation.

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCollectionContext } from "../state/CollectionContext";
import { Capsule, CAPSULE_COLOR_HEX } from "../models/Capsule";
import { useHaptics } from "../hooks/useHaptics";
import { useSound } from "../hooks/useSound";
import { useAndroidBackHandler } from "../hooks/useAndroidBackHandler";
import CapsuleCard from "../components/CapsuleCard";
import RarityBadge from "../components/RarityBadge";
import ParticleBurst from "../components/ParticleBurst";
import ShareSheet from "../components/ShareSheet";
import BottomTabBar from "../components/BottomTabBar";
import { DURATIONS } from "../animations/machineAnimations";

interface RevealScreenProps {
  capsuleId: string;
}

export default function RevealScreen({ capsuleId }: RevealScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const sound = useSound();
  const { updateCapsule, getCapsule } = useCollectionContext();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpened, setIsOpened] = useState(false);

  const handleAndroidBack = useCallback(() => {
    router.replace("/collection");
    return true;
  }, [router]);

  useAndroidBackHandler(handleAndroidBack);

  // Animation values
  const topHalfTranslate = useSharedValue(0);
  const bottomHalfTranslate = useSharedValue(0);
  const cardScale = useSharedValue(0);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    (async () => {
      const c = await getCapsule(capsuleId);
      setCapsule(c);
      setIsLoading(false);
      if (c?.isOpened) {
        setIsOpened(true);
        topHalfTranslate.value = -90;
        bottomHalfTranslate.value = 30;
        cardScale.value = 1;
        cardOpacity.value = 1;
      }
    })();
  }, [capsuleId]);

  const handleOpen = () => {
    if (isOpened) return;
    haptics.selection();
    sound.play("capsuleOpen");

    topHalfTranslate.value = withSpring(-90, { stiffness: 180, damping: 14 });
    bottomHalfTranslate.value = withSpring(30, { stiffness: 180, damping: 14 });

    setTimeout(() => {
      cardScale.value = withSpring(1, { stiffness: 200, damping: 15 });
      cardOpacity.value = withTiming(1, { duration: DURATIONS.REVEAL });
      haptics.reveal();
      sound.play("revealChime");
    }, 200);

    setIsOpened(true);

    if (capsule && !capsule.isOpened) {
      const updated = { ...capsule, isOpened: true, openedAt: new Date().toISOString() };
      updateCapsule(updated);
      setCapsule(updated);
    }
  };

  const swipeGesture = Gesture.Pan()
    .enabled(!isOpened)
    .minDistance(20)
    .onEnd(() => {
      runOnJS(handleOpen)();
    });

  const tapGesture = Gesture.Tap()
    .enabled(!isOpened)
    .onEnd(() => {
      runOnJS(handleOpen)();
    });

  const combinedGesture = Gesture.Simultaneous(swipeGesture, tapGesture);

  const topHalfStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: topHalfTranslate.value }],
  }));

  const bottomHalfStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomHalfTranslate.value }],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#D4AF37" />
        </View>
      </SafeAreaView>
    );
  }

  if (!capsule) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Capsule record not found.</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>← Return</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const colorHex = CAPSULE_COLOR_HEX[capsule.capsuleColor] ?? "#FAFAFA";
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
            style={styles.backBtnContainer}
            onPress={() => {
              haptics.selection();
              router.replace("/collection");
            }}
          >
            <Text style={styles.backBtn}>← BINDER</Text>
          </TouchableOpacity>
          <RarityBadge rarity={capsule.rarity} />
        </View>

        {/* Capsule Unboxing Stage */}
        <View style={styles.capsuleArea}>
          <GestureDetector gesture={combinedGesture}>
            <TouchableOpacity
              activeOpacity={!isOpened ? 0.9 : 1}
              onPress={handleOpen}
              style={styles.capsuleWrapper}
            >
              {/* Top half */}
              <Animated.View
                style={[
                  styles.capsuleHalf,
                  styles.capsuleTop,
                  { backgroundColor: colorHex },
                  topHalfStyle,
                ]}
              >
                <View style={styles.glossTop} />
              </Animated.View>
              {/* Bottom half */}
              <Animated.View
                style={[
                  styles.capsuleHalf,
                  styles.capsuleBottom,
                  { backgroundColor: colorHex },
                  bottomHalfStyle,
                ]}
              >
                <View style={styles.glossBottom} />
              </Animated.View>
            </TouchableOpacity>
          </GestureDetector>

          {/* Polaroid photo card */}
          <Animated.View style={[styles.cardContainer, cardStyle]}>
            <CapsuleCard capsule={capsule} />
            <ParticleBurst color={colorHex} isVisible={isOpened} />
          </Animated.View>
        </View>

        {/* Action Controls */}
        <View style={styles.bottomArea}>
          {!isOpened ? (
            <TouchableOpacity
              style={styles.instructionRow}
              onPress={handleOpen}
              activeOpacity={0.8}
            >
              <Text style={styles.instructionText}>✦ TAP OR SWIPE UP TO UNBOX CAPSULE ✦</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: "100%", alignItems: "center" }}>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => {
                    haptics.selection();
                    sound.play("handleClick");
                    router.push({ pathname: "/collection" });
                  }}
                >
                  <Text style={styles.actionBtnText}>📦 BINDER</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.secondaryBtn]}
                  onPress={() => {
                    haptics.selection();
                    sound.play("handleClick");
                    router.push("/capture");
                  }}
                >
                  <Text style={styles.actionBtnText}>📸 NEW FRAME</Text>
                </TouchableOpacity>
              </View>

              {/* Social Share Card Trigger */}
              <ShareSheet capsule={capsule} />
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
  content: { flexGrow: 1, paddingHorizontal: 18, paddingBottom: 110 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 14, color: "#888890", marginBottom: 16 },
  backLink: { fontSize: 14, color: "#D4AF37", fontWeight: "900" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backBtnContainer: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  backBtn: { fontSize: 11, fontWeight: "900", color: "#D4AF37", letterSpacing: 1.5 },
  capsuleArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  capsuleWrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    marginBottom: 20,
    zIndex: 1,
  },
  capsuleHalf: {
    width: 130,
    height: 65,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  capsuleTop: {
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    borderBottomWidth: 0,
    marginBottom: -2,
  },
  capsuleBottom: {
    borderBottomLeftRadius: 65,
    borderBottomRightRadius: 65,
    borderTopWidth: 0,
  },
  glossTop: {
    position: "absolute",
    top: 8,
    left: 18,
    right: 18,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  glossBottom: {
    position: "absolute",
    top: 6,
    left: 18,
    right: 18,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  cardContainer: {
    position: "absolute",
    alignItems: "center",
    zIndex: 10,
  },
  bottomArea: {
    paddingVertical: 20,
    alignItems: "center",
  },
  instructionRow: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: "#16161C",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#D4AF37",
  },
  instructionText: { fontSize: 12, fontWeight: "900", color: "#D4AF37", letterSpacing: 1.5 },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#C8372D",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#D4AF37",
  },
  secondaryBtn: {
    backgroundColor: "#16161C",
    borderColor: "rgba(255,255,255,0.15)",
  },
  actionBtnText: { fontSize: 13, fontWeight: "900", color: "#FFF", letterSpacing: 1 },
});
