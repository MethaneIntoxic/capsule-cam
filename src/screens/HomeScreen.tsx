// src/screens/HomeScreen.tsx
// High-End Industrial Camera & Gashapon Lounge UI.

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCollectionContext } from "../state/CollectionContext";
import { useHaptics } from "../hooks/useHaptics";
import { useSound } from "../hooks/useSound";
import CapsuleThumbnail from "../components/CapsuleThumbnail";
import { Capsule } from "../models/Capsule";

import SoundToggle from "../components/SoundToggle";
import BottomTabBar from "../components/BottomTabBar";
import { audioEngine } from "../utils/audioEngine";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { capsules } = useCollectionContext();
  const haptics = useHaptics();
  const sound = useSound();
  const [isMuted, setIsMuted] = React.useState(audioEngine.getMuted());

  const handleToggleSound = () => {
    const nextState = audioEngine.toggleMute();
    setIsMuted(nextState);
  };

  const recentCapsules = capsules.slice(0, 8);
  const rareCount = capsules.filter((c) => c.rarity === "rare" || c.rarity === "special" || c.rarity === "ultra_rare" || c.rarity === "legendary").length;

  const navigateWithHaptics = (route: any, params?: any) => {
    haptics.selection();
    sound.play("handleClick");
    if (params) {
      router.push({ pathname: route, params });
    } else {
      router.push(route);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <View style={styles.brandBadge}>
            <Text style={styles.logoText}>✦ CAPSULE CAM</Text>
            <Text style={styles.subLogo}>ANALOG FILM & GASHAPON STUDIO</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <SoundToggle isMuted={isMuted} onToggle={handleToggleSound} />
            <TouchableOpacity
              style={styles.collectionBtn}
              onPress={() => navigateWithHaptics("/collection")}
              activeOpacity={0.8}
            >
              <Text style={styles.collectionBadgeText}>{capsules.length}</Text>
              <Text style={styles.collectionLabel}>BINDER</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Industrial Ticker Banner */}
        <View style={styles.tickerBanner}>
          <Text style={styles.tickerText}>
            ✦ CAPTURE MEMORY ✦ CRANK MECHANICAL KNOB ✦ COLLECT 35MM FOIL CARDS ✦
          </Text>
        </View>

        {/* Hero Machine Poster */}
        <View style={styles.heroCard}>
          <View style={styles.heroLensVisual}>
            <Text style={styles.heroLensBadge}>35MM F/2.0</Text>
            <View style={styles.heroLensAperture}>
              <Text style={styles.apertureSymbol}>◈</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Transform Photos into Collectible Film Capsules</Text>
          <Text style={styles.heroSub}>
            Precision analog gashapon mechanism. Snap photos, crank the 360° handle, and reveal limited edition polaroid photo cards.
          </Text>

          {/* Main Action Button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigateWithHaptics("/capture")}
            activeOpacity={0.85}
          >
            <Text style={styles.createButtonIcon}>📸</Text>
            <Text style={styles.createButtonText}>CREATE NEW CAPSULE</Text>
          </TouchableOpacity>
        </View>

        {/* Industrial Counter Bar */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{capsules.length}</Text>
            <Text style={styles.statLabel}>COLLECTED</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#D4AF37" }]}>{rareCount}</Text>
            <Text style={styles.statLabel}>RARE / SPECIAL</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#00E5FF" }]}>8</Text>
            <Text style={styles.statLabel}>COLOR EDITIONS</Text>
          </View>
        </View>

        {/* Recent Shelf */}
        {recentCapsules.length > 0 ? (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>RECENT CAPSULES</Text>
              <TouchableOpacity onPress={() => navigateWithHaptics("/collection")}>
                <Text style={styles.viewAllText}>COLLECTION BINDER →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.shelfBox}>
              <FlatList
                data={recentCapsules}
                keyExtractor={(item: Capsule) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentList}
                renderItem={({ item }) => (
                  <CapsuleThumbnail
                    capsule={item}
                    size={76}
                    onPress={() => navigateWithHaptics("/reveal", { capsuleId: item.id })}
                  />
                )}
              />
              <View style={styles.shelfLedge} />
            </View>
          </View>
        ) : (
          <View style={styles.emptyShelfBox}>
            <Text style={styles.emptyShelfIcon}>✦</Text>
            <Text style={styles.emptyShelfText}>No Capsules in Dispenser</Text>
            <Text style={styles.emptyShelfSub}>Tap CREATE NEW CAPSULE to start your collection.</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Bottom Tab Navigation */}
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0E12",
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 90,
    gap: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandBadge: {
    backgroundColor: "#16161C",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#D4AF37",
  },
  logoText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#D4AF37",
    letterSpacing: 2,
  },
  subLogo: {
    fontSize: 8,
    fontWeight: "800",
    color: "#A0A0A8",
    letterSpacing: 1.5,
    marginTop: 2,
  },
  collectionBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16161C",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  collectionBadgeText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#D4AF37",
  },
  collectionLabel: {
    fontSize: 8,
    fontWeight: "900",
    color: "#A0A0A8",
    letterSpacing: 1,
  },
  tickerBanner: {
    backgroundColor: "#16161C",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
    overflow: "hidden",
  },
  tickerText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#D4AF37",
    textAlign: "center",
    letterSpacing: 1.5,
  },
  heroCard: {
    backgroundColor: "#16161C",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.12)",
    padding: 20,
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  heroLensVisual: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#0D0E12",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#D4AF37",
    marginBottom: 14,
    position: "relative",
  },
  heroLensBadge: {
    position: "absolute",
    top: 6,
    fontSize: 7,
    fontWeight: "900",
    color: "#D4AF37",
    letterSpacing: 1,
  },
  heroLensAperture: {
    justifyContent: "center",
    alignItems: "center",
  },
  apertureSymbol: {
    fontSize: 28,
    color: "#D4AF37",
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#E2DFD7",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 23,
    letterSpacing: 0.5,
  },
  heroSub: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9A9A9F",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
  },
  createButton: {
    width: "100%",
    height: 58,
    backgroundColor: "#C8372D",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#D4AF37",
    shadowColor: "#C8372D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    gap: 10,
  },
  createButtonIcon: { fontSize: 20 },
  createButtonText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1.5,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#16161C",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "900", color: "#E2DFD7" },
  statLabel: { fontSize: 9, fontWeight: "900", color: "#777780", letterSpacing: 1.5, marginTop: 2 },
  statDivider: { width: 1, height: 24, backgroundColor: "rgba(255,255,255,0.1)" },
  recentSection: { marginTop: 4 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#D4AF37",
    letterSpacing: 1.5,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#00E5FF",
    letterSpacing: 1,
  },
  shelfBox: {
    backgroundColor: "#16161C",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
    position: "relative",
  },
  recentList: { gap: 14, paddingRight: 10 },
  shelfLedge: {
    height: 4,
    backgroundColor: "#D4AF37",
    borderRadius: 2,
    marginTop: 12,
    opacity: 0.7,
  },
  emptyShelfBox: {
    backgroundColor: "#16161C",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
  },
  emptyShelfIcon: { fontSize: 28, color: "#D4AF37", marginBottom: 8 },
  emptyShelfText: { fontSize: 14, fontWeight: "900", color: "#E2DFD7", marginBottom: 4 },
  emptyShelfSub: { fontSize: 12, color: "#777780", textAlign: "center" },
});
