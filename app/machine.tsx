// app/machine.tsx
// Gashapon machine screen route.
// Receives imageUri, caption, and filmFilter from route params.

import { useLocalSearchParams } from "expo-router";
import MachineScreen from "../src/screens/MachineScreen";
import { MachineProvider } from "../src/state/MachineContext";

const DEFAULT_SAMPLE_IMAGE = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop";

export default function Machine() {
  const { imageUri, caption, filmFilter } = useLocalSearchParams<{
    imageUri?: string;
    caption?: string;
    filmFilter?: string;
  }>();

  const activeImageUri = imageUri || DEFAULT_SAMPLE_IMAGE;

  return (
    <MachineProvider>
      <MachineScreen imageUri={activeImageUri} caption={caption} filmFilter={filmFilter} />
    </MachineProvider>
  );
}
