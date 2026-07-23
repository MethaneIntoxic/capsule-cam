// src/components/RecentCapsules.tsx
// Horizontal scroll of recent capsules for the home screen.

import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Capsule } from "../models/Capsule";
import CapsuleThumbnail from "./CapsuleThumbnail";

interface RecentCapsulesProps {
  capsules: Capsule[];
  onSelect: (capsule: Capsule) => void;
}

export default function RecentCapsules({
  capsules,
  onSelect,
}: RecentCapsulesProps) {
  if (capsules.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Capsules</Text>
      <FlatList
        data={capsules}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CapsuleThumbnail
            capsule={item}
            size={72}
            onPress={() => onSelect(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#B0B0B0",
    marginBottom: 12,
  },
  list: {
    gap: 12,
    paddingHorizontal: 4,
  },
});
