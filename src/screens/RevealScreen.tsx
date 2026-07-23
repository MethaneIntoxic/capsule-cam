// src/screens/RevealScreen.tsx
// Capsule reveal screen — shows the capsule, swipe to open, then the photo card.

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Capsule, CAPSULE_COLOR_HEX } from "../models/Capsule";
import { useCollectionContext } from "../state/CollectionContext";
import { useHaptics } from "../hooks/useHaptics";
import CapsuleCard from "../components/CapsuleCard";
import RarityBadge from "../components/RarityBadge";
import { DURATIONS } from "../animations/machineAnimations";

interface RevealScreenProps {
  capsuleId: string;
}

export default function RevealScreen({ capsuleId }: RevealScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const { updateCapsule, getCapsule } = useCollectionContext();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpened, setIsOpened] = useState(false);

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
      // Auto-open if already opened
      if (c?.isOpened) {
        setIsOpened(true);
        topHalfTranslate.value = -80;
        bottomHalfTranslate.value = 20;
        cardScale.value = 1;
        cardOpacity.value = 1;
      }
    })();
  }, [capsuleId]);

  const handleOpen = () => {
    if (isOpened) return;
    haptics.tick();

    // Animate top half up and bottom half down
    topHalfTranslate.value = withTiming(-80, {
      duration: DURATIONS.OPEN,
      easing: Easing.out(Easing.back(1.5)),
    });

    bottomHalfTranslate.value = withTiming(20, {
      duration: DURATIONS.OPEN,
      easing: Easing.out(Easing.back(1.2)),
    });

    // Card appears after a delay
    setTimeout(() => {
      cardScale.value = withTiming(1, {
        duration: DURATIONS.REVEAL,
        easing: Easing.out(Easing.back(1.2)),
      });
      cardOpacity.value = withTiming(1, { duration: DURATIONS.REVEAL });
      haptics.reveal();
    }, DURATIONS.OPEN * 0.6);

    setIsOpened(true);

    // Mark capsule as opened via context (upserts to AsyncStorage + React state)
    if (capsule && !capsule.isOpened) {
      const updated = { ...capsule, isOpened: true, openedAt: new Date().toISOString() };
      updateCapsule(updated);
      setCapsule(updated);
    }
  };

  // Swipe gesture to open
  const swipeGesture = Gesture.Pan()
    .enabled(!isOpened)
    .minDistance(30)
    .onEnd(() => {
      runOnJS(handleOpen)();
    });

  // Animated styles
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
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      </SafeAreaView>
    );
  }

  if (!capsule) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Capsule not found.</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const colorHex = CAPSULE_COLOR_HEX[capsule.capsuleColor] ?? "#FAFAFA";

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 8 }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <RarityBadge rarity={capsule.rarity} />
        </View>

        {/* Capsule Area */}
        <View style={styles.capsuleArea}>
          {!isOpened ? (
            <GestureDetector gesture={swipeGesture}>
              <View style={styles.capsuleWrapper}>
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
              </View>
            </GestureDetector>
          ) : (
            <View style={styles.capsuleWrapper}>
              {/* Show opened halves, slightly separated */}
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
            </View>
          )}

          {/* Revealed Card */}
          <Animated.View style={[styles.cardContainer, cardStyle]}>
            <CapsuleCard capsule={capsule} />
          </Animated.View>
        </View>

        {/* Instruction / Action buttons */}
        <View style={styles.bottomArea}>
          {!isOpened ? (
            <View style={styles.instructionRow}>
              <Text style={styles.instructionText}>Swipe up to open</Text>
            </View>
          ) : (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  router.push({ pathname: "/collection" });
                }}
              >
                <Text style={styles.actionBtnText}>📦 Collection</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.secondaryBtn]}
                onPress={() => {
                  router.push("/capture");
                }}
              >
                <Text style={styles.actionBtnText}>🔄 New</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A2E" },
  content: { flex: 1, paddingHorizontal: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "#B0B0B0", marginBottom: 16 },
  backLink: { fontSize: 16, color: "#FFD700" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: { fontSize: 16, color: "#FFD700" },
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
  },
  capsuleHalf: {
    width: 120,
    height: 60,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  capsuleTop: {
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderBottomWidth: 0,
    marginBottom: -2,
  },
  capsuleBottom: {
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    borderTopWidth: 0,
  },
  glossTop: {
    position: "absolute",
    top: 8,
    left: 16,
    right: 16,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  glossBottom: {
    position: "absolute",
    top: 6,
    left: 16,
    right: 16,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  cardContainer: {
    position: "absolute",
    alignItems: "center",
  },
  bottomArea: {
    paddingVertical: 24,
    alignItems: "center",
  },
  instructionRow: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: "rgba(255,215,0,0.15)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  instructionText: { fontSize: 16, fontWeight: "600", color: "#FFD700" },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    paddingHorizontal: 20,
  },
  actionBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#D32F2F",
    alignItems: "center",
  },
  secondaryBtn: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  actionBtnText: { fontSize: 16, fontWeight: "700", color: "#FFF" },
});
