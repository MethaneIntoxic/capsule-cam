// src/screens/HomeScreen.tsx
// Main entry screen — Retro Arcade Gashapon Lounge UI.

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCollectionContext } from "../state/CollectionContext";
import CapsuleThumbnail from "../components/CapsuleThumbnail";
import { Capsule } from "../models/Capsule";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { capsules } = useCollectionContext();

  const recentCapsules = capsules.slice(0, 8);
  const rareCount = capsules.filter((c) => c.rarity === "rare" || c.rarity === "special").length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <View style={styles.brandBadge}>
            <Text style={styles.logoText}>✦ CAPSULE CAM</Text>
            <Text style={styles.subLogo}>ANALOG GASHAPON STUDIO</Text>
          </View>
          <TouchableOpacity
            style={styles.collectionBtn}
            onPress={() => router.push("/collection")}
          >
            <Text style={styles.collectionIcon}>📦</Text>
            <Text style={styles.collectionBadgeText}>{capsules.length}</Text>
          </TouchableOpacity>
        </View>

        {/* Y2K Ticker Banner */}
        <View style={styles.tickerBanner}>
          <Text style={styles.tickerText}>
            ✦ SNAP PHOTO ✦ INSERT COIN ✦ CRANK HANDLE ✦ COLLECT RARE TOYS ✦
          </Text>
        </View>

        {/* Hero Gashapon Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroDomeVisual}>
            <Text style={styles.heroDomeIcon}>🎰</Text>
            <View style={styles.heroSparkleLeft}><Text style={styles.sparkleText}>✨</Text></View>
            <View style={styles.heroSparkleRight}><Text style={styles.sparkleText}>✦</Text></View>
          </View>
          <Text style={styles.heroTitle}>Turn your photos into collectible digital capsules!</Text>
          <Text style={styles.heroSub}>
            Snap a picture, drop it in the gashapon machine, crank the handle 360°, and unlock rare analog cards.
          </Text>

          {/* Main Action Button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push("/capture")}
            activeOpacity={0.85}
          >
            <Text style={styles.createButtonIcon}>📸</Text>
            <Text style={styles.createButtonText}>CREATE CAPSULE</Text>
          </TouchableOpacity>
        </View>

        {/* Arcade Stats Counter Bar */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{capsules.length}</Text>
            <Text style={styles.statLabel}>COLLECTED</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#FFD700" }]}>{rareCount}</Text>
            <Text style={styles.statLabel}>RARE / SPECIAL</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#00E5FF" }]}>8</Text>
            <Text style={styles.statLabel}>TIERS</Text>
          </View>
        </View>

        {/* Recent Shelf */}
        {recentCapsules.length > 0 ? (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>COLLECTION SHELF</Text>
              <TouchableOpacity onPress={() => router.push("/collection")}>
                <Text style={styles.viewAllText}>SEE ALL →</Text>
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
                    onPress={() =>
                      router.push({ pathname: "/reveal", params: { capsuleId: item.id } })
                    }
                  />
                )}
              />
              <View style={styles.shelfLedge} />
            </View>
          </View>
        ) : (
          <View style={styles.emptyShelfBox}>
            <Text style={styles.emptyShelfIcon}>🔮</Text>
            <Text style={styles.emptyShelfText}>No capsules in your machine yet!</Text>
            <Text style={styles.emptyShelfSub}>Tap CREATE CAPSULE to make your first one.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0D15",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandBadge: {
    backgroundColor: "#1D182A",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFB703",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFB703",
    letterSpacing: 1.5,
  },
  subLogo: {
    fontSize: 8,
    fontWeight: "800",
    color: "#B0B0B0",
    letterSpacing: 1,
  },
  collectionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2B2D42",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.15)",
    gap: 6,
  },
  collectionIcon: { fontSize: 18 },
  collectionBadgeText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFD700",
  },
  tickerBanner: {
    backgroundColor: "#FFB703",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    overflow: "hidden",
  },
  tickerText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#111",
    textAlign: "center",
    letterSpacing: 1,
  },
  heroCard: {
    backgroundColor: "#1D182A",
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.12)",
    padding: 20,
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  heroDomeVisual: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFB703",
    marginBottom: 12,
    position: "relative",
  },
  heroDomeIcon: { fontSize: 42 },
  heroSparkleLeft: { position: "absolute", top: -4, left: -4 },
  heroSparkleRight: { position: "absolute", bottom: -4, right: -4 },
  sparkleText: { fontSize: 16, color: "#FFD700" },
  heroTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 6,
    lineHeight: 24,
  },
  heroSub: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A0A0B0",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
  },
  createButton: {
    width: "100%",
    height: 64,
    backgroundColor: "#E63946",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFB703",
    shadowColor: "#E63946",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 10,
    gap: 12,
  },
  createButtonIcon: { fontSize: 24 },
  createButtonText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1.5,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#161522",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "900", color: "#FFF" },
  statLabel: { fontSize: 9, fontWeight: "800", color: "#888", letterSpacing: 1, marginTop: 2 },
  statDivider: { width: 1, height: 24, backgroundColor: "rgba(255,255,255,0.1)" },
  recentSection: { marginTop: 4 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#FFB703",
    letterSpacing: 1.5,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#00E5FF",
  },
  shelfBox: {
    backgroundColor: "#161522",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
    position: "relative",
  },
  recentList: { gap: 14, paddingRight: 10 },
  shelfLedge: {
    height: 6,
    backgroundColor: "#FFB703",
    borderRadius: 3,
    marginTop: 12,
    opacity: 0.6,
  },
  emptyShelfBox: {
    backgroundColor: "#161522",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
  },
  emptyShelfIcon: { fontSize: 36, marginBottom: 8 },
  emptyShelfText: { fontSize: 14, fontWeight: "800", color: "#FFF", marginBottom: 4 },
  emptyShelfSub: { fontSize: 12, color: "#777", textAlign: "center" },
});
