// src/screens/HomeScreen.tsx
// Main entry screen — Create button, recent capsules, collection link.

import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Dimensions } from "react-native";
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

  const recentCapsules = capsules.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 16 }]}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={styles.logo}>✦ Capsule Cam</Text>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => router.push("/collection")}
          >
            <Text style={styles.settingsIcon}>📦</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Create Capsule CTA */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/capture")}
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonIcon}>✨</Text>
          <Text style={styles.createButtonText}>Create a Capsule</Text>
        </TouchableOpacity>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Recent Capsules */}
        {recentCapsules.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Capsules</Text>
            <FlatList
              data={recentCapsules}
              keyExtractor={(item: Capsule) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentList}
              renderItem={({ item }) => (
                <CapsuleThumbnail
                  capsule={item}
                  size={72}
                  onPress={() =>
                    router.push({ pathname: "/reveal", params: { capsuleId: item.id } })
                  }
                />
              )}
            />
          </View>
        )}

        {/* Collection Link */}
        <TouchableOpacity
          style={styles.collectionLink}
          onPress={() => router.push("/collection")}
        >
          <Text style={styles.collectionLinkText}>
            📦 View Collection {capsules.length > 0 ? `(${capsules.length})` : ""}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  settingsBtn: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 24,
  },
  createButton: {
    alignSelf: "center",
    width: Math.min(width - 48, 280),
    height: 72,
    backgroundColor: "#D32F2F",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D32F2F",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    gap: 12,
  },
  createButtonIcon: {
    fontSize: 28,
  },
  createButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  recentSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#B0B0B0",
    marginBottom: 12,
  },
  recentList: {
    gap: 12,
  },
  collectionLink: {
    alignSelf: "center",
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  collectionLinkText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFD700",
  },
});
