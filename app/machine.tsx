// app/machine.tsx
// Gashapon machine screen route.
// Receives imageUri and optional caption from route params.

import { useLocalSearchParams } from "expo-router";
import MachineScreen from "../src/screens/MachineScreen";
import { MachineProvider } from "../src/state/MachineContext";

export default function Machine() {
  const { imageUri, caption } = useLocalSearchParams<{
    imageUri: string;
    caption?: string;
  }>();

  if (!imageUri) {
    // No image provided — redirect back
    return null;
  }

  return (
    <MachineProvider>
      <MachineScreen imageUri={imageUri} caption={caption} />
    </MachineProvider>
  );
}
