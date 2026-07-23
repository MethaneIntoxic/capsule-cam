// app/reveal.tsx
// Capsule reveal screen route.
// Receives capsuleId from route params.

import { useLocalSearchParams } from "expo-router";
import RevealScreen from "../src/screens/RevealScreen";
import { View, Text, StyleSheet } from "react-native";

export default function Reveal() {
  const { capsuleId } = useLocalSearchParams<{ capsuleId: string }>();

  if (!capsuleId) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No capsule specified.</Text>
      </View>
    );
  }

  return <RevealScreen capsuleId={capsuleId} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1A1A2E" },
  text: { color: "#B0B0B0", fontSize: 16 },
});
