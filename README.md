# Capsule Cam 📸✨

Turn your photos into collectible digital capsules. Snap a picture, drop it in the gashapon machine, turn the handle, and get a randomly generated capsule to keep or share.

## Features

- **📸 Capture or Import** — Take a photo or pick one from your gallery
- **✂️ Crop & Caption** — Square or portrait crop, add a short caption
- **🎰 Gashapon Machine** — Drag the handle to activate the machine
- **💊 Randomised Capsules** — 8 colours × 3 rarity tiers (Common 75% / Rare 20% / Special 5%)
- **✨ Animated Reveal** — Shake → drop → swipe open → card reveal
- **📦 Collection Shelf** — All your capsules in one place, filter by rarity
- **🔊 Haptics + Sound** — Tactile feedback at every step
- **💾 Local Storage** — Everything stays on your device

## Tech Stack

| | |
|---|---|
| **Framework** | React Native (Expo SDK 57) |
| **Language** | TypeScript (strict mode) |
| **Navigation** | Expo Router (file-based) |
| **Animations** | react-native-reanimated 4 |
| **Gestures** | react-native-gesture-handler |
| **Camera** | expo-camera |
| **Image picker** | expo-image-picker |
| **Persistence** | @react-native-async-storage/async-storage |
| **Haptics** | expo-haptics |
| **Sound** | expo-av |

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) or press `a` for Android emulator / `i` for iOS simulator.

## Project Structure

```
app/                   # Expo Router routes (file-based)
  _layout.tsx          # Root layout — gesture handler, safe area, contexts
  index.tsx            # Home screen
  capture.tsx          # Image picker
  machine.tsx          # Gashapon machine
  reveal.tsx           # Capsule reveal
  collection.tsx       # Collection shelf
src/
  components/          # Reusable UI components (14)
  screens/             # Screen logic (5)
  hooks/               # Custom React hooks (7)
  animations/          # Reanimated animation configs (5)
  models/              # TypeScript types + factories (3)
  state/               # React Context providers (2)
  storage/             # AsyncStorage persistence (3)
  utils/               # Utility functions (5)
assets/                # Images, sounds (Phase 2)
```

## Deployment

### Web (GitHub Pages)
```bash
npx expo export --platform web --output-dir dist
```
The repo includes a GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) that auto-deploys on push.

### Mobile (TestFlight / Google Play)
Use EAS Build:
```bash
npx eas build --platform ios    # iOS
npx eas build --platform android  # Android
```

## License

MIT
