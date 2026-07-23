# Capsule Cam — Build Blueprint

> **Status:** Draft — ready for Phase 1 implementation.
> **Target:** React Native (Expo) MVP for iOS & Android.
> **Last updated:** 2025-07-23

---

## Table of Contents

1. [Project Scaffold & Toolchain](#1-project-scaffold--toolchain)
2. [Directory Map (every file)](#2-directory-map-every-file)
3. [Package Inventory](#3-package-inventory)
4. [Type System & Data Model](#4-type-system--data-model)
5. [State Architecture](#5-state-architecture)
6. [Navigation & Route Table](#6-navigation--route-table)
7. [Screen Specifications](#7-screen-specifications)
8. [Component Catalogue](#8-component-catalogue)
9. [Animation State Machine](#9-animation-state-machine)
10. [Gesture Pipeline (Handle)](#10-gesture-pipeline-handle)
11. [Capsule Randomisation Engine](#11-capsule-randomisation-engine)
12. [Sound & Haptics Map](#12-sound--haptics-map)
13. [Storage Layer](#13-storage-layer)
14. [Export & Sharing Pipeline](#14-export--sharing-pipeline)
15. [Asset Manifest](#15-asset-manifest)
16. [Phase-by-Phase Build Order](#16-phase-by-phase-build-order)
17. [Per-File Implementation Notes](#17-per-file-implementation-notes)
18. [Testing Strategy](#18-testing-strategy)
19. [Performance Budget](#19-performance-budget)
20. [Risk Register](#20-risk-register)

---

## 1. Project Scaffold & Toolchain

### 1.1 Initialisation

```bash
npx create-expo-app@latest capsule-cam --template blank-typescript
cd capsule-cam
```

### 1.2 Toolchain Versions (locked)

| Tool              | Version     | Notes                              |
| ----------------- | ----------- | ---------------------------------- |
| Node.js           | ≥ 20 LTS    |                                    |
| Expo SDK          | 52          | Latest stable at planning time     |
| React Native      | 0.76.x      | Ships with Expo 52                 |
| TypeScript        | 5.x         | Strict mode enabled                |
| Expo Router       | 4.x         | File-based routing                 |

### 1.3 TypeScript Config Highlights

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@screens/*": ["./src/screens/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@storage/*": ["./src/storage/*"],
      "@models/*": ["./src/models/*"],
      "@animations/*": ["./src/animations/*"],
      "@assets/*": ["./src/assets/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}
```

---

## 2. Directory Map (every file)

```
capsule-cam/
├── app/                          # Expo Router file-based routes
│   ├── _layout.tsx               # Root layout (stack navigator)
│   ├── index.tsx                 # Home screen (route: /)
│   ├── capture.tsx               # Image selection screen (route: /capture)
│   ├── machine.tsx               # Gashapon machine screen (route: /machine)
│   ├── reveal.tsx                # Capsule reveal screen (route: /reveal)
│   └── collection.tsx            # Collection shelf (route: /collection)
│
├── src/
│   ├── components/
│   │   ├── Capsule3D.tsx         # 3D-ish capsule renderer (two halves)
│   │   ├── CapsuleCard.tsx       # Flat collectible card (revealed photo)
│   │   ├── CapsuleThumbnail.tsx  # Small capsule for shelf/recents
│   │   ├── GashaponMachine.tsx   # Machine body SVG/Canvas render
│   │   ├── MachineHandle.tsx     # Rotatable handle with gesture
│   │   ├── CapsuleTray.tsx       # Collection tray at machine bottom
│   │   ├── MachineGlass.tsx      # Transparent compartment + capsules inside
│   │   ├── CollectionGrid.tsx    # Grid layout for collection shelf
│   │   ├── CreateButton.tsx      # Large home-screen CTA
│   │   ├── RecentCapsules.tsx    # Horizontal scroll of recent capsules
│   │   ├── RarityBadge.tsx       # Common/Rare/Special indicator
│   │   ├── ParticleBurst.tsx     # Confetti/particle effect on reveal
│   │   ├── ShareSheet.tsx        # Export format picker + share trigger
│   │   └── SoundToggle.tsx       # Mute/unmute button
│   │
│   ├── screens/
│   │   ├── HomeScreen.tsx        # Screen logic for home
│   │   ├── ImagePickerScreen.tsx # Screen logic for capture
│   │   ├── MachineScreen.tsx     # Screen logic for machine interaction
│   │   ├── RevealScreen.tsx      # Screen logic for capsule opening
│   │   └── CollectionScreen.tsx  # Screen logic for shelf
│   │
│   ├── animations/
│   │   ├── machineAnimations.ts  # Shake, drop, bounce tweens
│   │   ├── capsuleAnimations.ts  # Open, reveal, card-appear tweens
│   │   ├── handleAnimations.ts   # Handle snap-back, idle sway
│   │   ├── particleAnimations.ts # Confetti burst config
│   │   └── transitions.ts        # Shared screen transitions
│   │
│   ├── hooks/
│   │   ├── useHandleGesture.ts   # Pan-gesture → rotation degrees
│   │   ├── useCapsuleCreation.ts # Full creation pipeline hook
│   │   ├── useCapsuleMachine.ts  # Machine state machine hook
│   │   ├── useCollection.ts      # CRUD operations on stored capsules
│   │   ├── useHaptics.ts         # Haptic pattern helpers
│   │   ├── useSound.ts           # Sound preload + play helpers
│   │   └── useImageExport.ts     # Static/video export generation
│   │
│   ├── storage/
│   │   ├── capsuleRepository.ts  # AsyncStorage CRUD for capsules
│   │   ├── settingsRepository.ts # Mute, theme, onboarding flags
│   │   └── migrations.ts         # Storage schema versioning
│   │
│   ├── models/
│   │   ├── Capsule.ts            # Capsule interface + factory
│   │   ├── MachineTheme.ts       # Theme definitions (colours, assets)
│   │   └── Rarity.ts             # Rarity enum + distribution weights
│   │
│   ├── state/
│   │   ├── MachineContext.tsx     # React Context for machine state
│   │   └── CollectionContext.tsx  # React Context for collection state
│   │
│   ├── utils/
│   │   ├── randomiser.ts         # Capsule colour/rarity randomiser
│   │   ├── imageResizer.ts       # Downscale before storage
│   │   ├── exportLayout.ts       # 9:16 poster compositor
│   │   ├── angles.ts             # Trig helpers for handle rotation
│   │   └── uuid.ts               # Simple UUID generator
│   │
│   └── assets/
│       ├── images/
│       │   ├── machine-body.png
│       │   ├── machine-body.svg
│       │   ├── handle.png
│       │   ├── capsule-half-top.png
│       │   ├── capsule-half-bottom.png
│       │   ├── tray.png
│       │   ├── shelf-bg.png
│       │   └── logo.png
│       ├── sounds/
│       │   ├── handle-click.mp3
│       │   ├── capsule-rattle.mp3
│       │   ├── capsule-drop.mp3
│       │   ├── tray-impact.mp3
│       │   ├── capsule-open.mp3
│       │   └── reveal-chime.mp3
│       └── animations/
│           └── (Lottie JSON files if used)
│
├── app.json                     # Expo config
├── tsconfig.json
├── package.json
├── babel.config.js
└── BUILD_BLUEPRINT.md           # This file
```

---

## 3. Package Inventory

### 3.1 Core (install immediately)

```bash
npx expo install \
  expo-camera \
  expo-image-picker \
  expo-haptics \
  expo-av \
  expo-file-system \
  expo-sharing \
  expo-media-library \
  expo-splash-screen \
  expo-status-bar \
  expo-router \
  react-native-gesture-handler \
  react-native-reanimated \
  react-native-safe-area-context \
  react-native-screens \
  @react-native-async-storage/async-storage
```

### 3.2 Secondary (install when needed)

```bash
npx expo install \
  @shopify/react-native-skia \     # Phase 2+ — custom capsule rendering
  lottie-react-native \            # Phase 2+ — prebuilt animations
  expo-sqlite \                    # Phase 3 — if AsyncStorage is insufficient
  react-native-view-shot           # Phase 4 — capture views for static export
```

### 3.3 Dev Dependencies

```bash
npm install -D \
  @types/react \
  jest \
  @testing-library/react-native \
  eslint \
  prettier
```

---

## 4. Type System & Data Model

### 4.1 `src/models/Capsule.ts`

```typescript
export type CapsuleId = string;   // UUID v4
export type ISODateString = string;

export type CapsuleColor =
  | "pink"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "orange"
  | "white"
  | "black";

export type Rarity = "common" | "rare" | "special";

export type MachineTheme =
  | "classic_red"
  | "pastel"
  | "transparent_future"
  | "convenience_store"
  | "arcade";

export interface Capsule {
  id: CapsuleId;
  createdAt: ISODateString;
  imageUri: string;               // Local file:// URI
  thumbnailUri: string;           // Downscaled copy for grid
  caption: string | null;
  capsuleColor: CapsuleColor;
  machineTheme: MachineTheme;
  rarity: Rarity;
  isOpened: boolean;
  openedAt: ISODateString | null;
}

// Factory — ensures every capsule has defaults
export function createCapsule(partial: Partial<Capsule>): Capsule {
  const now = new Date().toISOString();
  return {
    id: partial.id ?? generateUUID(),
    createdAt: partial.createdAt ?? now,
    imageUri: partial.imageUri ?? "",
    thumbnailUri: partial.thumbnailUri ?? "",
    caption: partial.caption ?? null,
    capsuleColor: partial.capsuleColor ?? "white",
    machineTheme: partial.machineTheme ?? "classic_red",
    rarity: partial.rarity ?? "common",
    isOpened: partial.isOpened ?? false,
    openedAt: partial.openedAt ?? null,
  };
}
```

### 4.2 `src/models/Rarity.ts`

```typescript
import { Rarity } from "./Capsule";

export interface RarityConfig {
  rarity: Rarity;
  weight: number;         // 0–100, must sum to 100 across all entries
  label: string;
  borderColor: string;    // Hex colour for capsule rim
  glowColor: string;      // Hex colour for particle burst
  capsuleColorBias: string[]; // Colours this rarity leans toward
}

export const RARITY_TABLE: RarityConfig[] = [
  {
    rarity: "common",
    weight: 75,
    label: "Common",
    borderColor: "#C0C0C0",
    glowColor: "#E0E0E0",
    capsuleColorBias: ["pink", "blue", "green", "yellow", "white"],
  },
  {
    rarity: "rare",
    weight: 20,
    label: "Rare",
    borderColor: "#4FC3F7",
    glowColor: "#81D4FA",
    capsuleColorBias: ["purple", "orange", "blue"],
  },
  {
    rarity: "special",
    weight: 5,
    label: "Special",
    borderColor: "#FFD700",
    glowColor: "#FFF176",
    capsuleColorBias: ["black", "purple"],
  },
];
```

### 4.3 `src/models/MachineTheme.ts`

```typescript
export interface MachineThemeConfig {
  id: string;
  name: string;
  bodyColor: string;           // Primary machine body
  accentColor: string;         // Handle, trim
  glassColor: string;          // Compartment glass tint
  trayColor: string;           // Tray base colour
  backgroundGradient: [string, string]; // Screen background
  bodyImage?: string;          // require() path or null
}

export const CLASSIC_RED: MachineThemeConfig = {
  id: "classic_red",
  name: "Classic Red",
  bodyColor: "#D32F2F",
  accentColor: "#FFD700",
  glassColor: "rgba(255,255,255,0.25)",
  trayColor: "#424242",
  backgroundGradient: ["#1A1A2E", "#16213E"],
};
```

---

## 5. State Architecture

### 5.1 Machine State Machine (XState-style enum)

Located in `src/hooks/useCapsuleMachine.ts`:

```typescript
export type MachinePhase =
  | "idle"               // Waiting for image
  | "ready"              // Image loaded, handle visible, prompt shown
  | "turning"            // User is dragging handle
  | "activated"          // Threshold reached, commit randomisation
  | "shaking"            // Machine shake animation
  | "dispensing"         // Internal capsule moving down
  | "dropping"           // Capsule falling into tray
  | "landed"             // Capsule sitting in tray
  | "opening"            // User-driven capsule opening
  | "revealed"           // Photo visible as card
  | "completed";         // Save done, share/again buttons

export interface MachineState {
  phase: MachinePhase;
  currentCapsule: Capsule | null;
  handleRotation: number;        // 0–360 degrees
  error: string | null;
}
```

### 5.2 Context Providers

- **`MachineContext`** — holds `MachineState` + dispatch. Wraps the machine screen.
- **`CollectionContext`** — holds `Capsule[]`, loaded on app mount.

### 5.3 Data Flow (creation walkthrough)

```
User picks image
  → ImagePickerScreen sets pendingImageUri + pendingCaption
  → navigate to /machine
  → MachineScreen reads pending data from route params
  → useCapsuleMachine enters "ready"
  → User drags handle → useHandleGesture updates rotation
  → At 300° threshold → phase → "activated"
  → randomiser.ts runs → Capsule object created
  → phase → "shaking" → "dispensing" → "dropping" → "landed"
  → User opens capsule → phase → "opening" → "revealed"
  → capsuleRepository.save(capsule)
  → phase → "completed"
```

---

## 6. Navigation & Route Table

Using Expo Router (file-based). Every route maps to a file under `app/`.

| Route              | File               | Params                                  | Notes                        |
| ------------------ | ------------------ | --------------------------------------- | ---------------------------- |
| `/`                | `app/index.tsx`    | —                                       | Home screen                  |
| `/capture`         | `app/capture.tsx`  | —                                       | Camera + gallery picker      |
| `/machine`         | `app/machine.tsx`  | `imageUri: string`, `caption?: string`  | Core interaction screen      |
| `/reveal`          | `app/reveal.tsx`   | `capsuleId: string`                     | Re-open a saved capsule      |
| `/collection`      | `app/collection.tsx`| —                                      | Collection shelf             |

### Navigation Transitions

- Home → Capture: standard push (slide left)
- Capture → Machine: standard push
- Machine → Home: reset (pop to root) after "Create Another"
- Any → Collection: standard push
- Collection → Reveal: standard push

---

## 7. Screen Specifications

### 7.1 Home Screen (`app/index.tsx`)

```
┌──────────────────────────────┐
│  [logo]              [⚙️  🔇] │  ← Top bar: logo left, settings + sound right
│                              │
│    ┌──────────────────┐      │
│    │                  │      │
│    │   ✨  CREATE     │      │  ← Large CTA button (200×56 pt)
│    │    CAPSULE       │      │     Gradient background, rounded
│    │                  │      │     Navigates to /capture
│    └──────────────────┘      │
│                              │
│  Recent Capsules             │  ← Section header
│  ┌────┐ ┌────┐ ┌────┐ ┌───┐ │
│  │ C1 │ │ C2 │ │ C3 │ │ → │ │  ← Horizontal FlatList, 4 items visible
│  └────┘ └────┘ └────┘ └───┘ │
│                              │
│  [📦  View Collection]       │  ← Bottom link to /collection
└──────────────────────────────┘
```

**States:**
- **Empty:** "Create Capsule" CTA centred prominently. "Recent Capsules" hidden. Collection link dimmed.
- **With capsules:** Recent row populated. Collection link active with count badge.

### 7.2 Image Picker Screen (`app/capture.tsx`)

```
┌──────────────────────────────┐
│  ← Back        Crop & Caption│
│                              │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │    [Camera Preview     │  │  ← Live camera or selected image
│  │     or Image]          │  │
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  [📸 Take Photo]  [🖼️ Gallery]│  ← Two buttons side by side
│                              │
│  ┌────────────────────────┐  │
│  │ Add a caption...       │  │  ← TextInput, max 60 chars
│  └────────────────────────┘  │
│                              │
│  [ Crop square ◻️ ]          │  ← Toggle crop mode
│                              │
│         [▶️  Insert into     │  ← Disabled until image selected
│           Machine]          │     Navigates to /machine
└──────────────────────────────┘
```

**Crop spec:** Square aspect ratio (1:1), 1024×1024 output. Use `expo-image-manipulator` or a simple gesture-based crop overlay.

### 7.3 Machine Screen (`app/machine.tsx`)

```
┌──────────────────────────────┐
│  ← Back          [🔇]        │
│                              │
│   ┌──────────────────────┐   │
│   │                      │   │
│   │   [Glass Dome]       │   │  ← Shows user's image thumbnail inside
│   │   ┌──────────┐       │   │
│   │   │ preview  │       │   │
│   │   └──────────┘       │   │
│   │                      │   │
│   │   ┌──────────────┐   │   │
│   │   │  Capsule     │   │   │  ← Rendered capsule waiting to drop
│   │   │  compartment │   │   │
│   │   └──────────────┘   │   │
│   │                      │   │
│   └──────────────────────┘   │
│                              │
│     ╭──────────╮             │
│     │  HANDLE  │ ← draggable │  ← Circular/arc gesture area
│     ╰──────────╯             │
│                              │
│  "Turn the handle!"          │  ← Instruction text (hidden during drag)
│                              │
│  ┌────────────────────────┐  │
│  │     [Collection Tray]  │  │  ← Where the capsule lands
│  └────────────────────────┘  │
└──────────────────────────────┘
```

**Layout notes:**
- Machine body: SVG or stacked `<View>` components with rounded corners + shadows.
- Handle: absolutely positioned `<View>` with `transform: rotate()` driven by gesture. Pivot point at handle base.
- Tray: fixed at bottom, capsule animates into it from above.

### 7.4 Reveal Screen (`app/reveal.tsx`)

```
┌──────────────────────────────┐
│  ← Back                     │
│                              │
│        ┌──────────┐          │
│        │  Top     │          │  ← Top half, moves up on open
│        │  Half    │          │
│        ├──────────┤          │
│        │  Bottom  │          │  ← Bottom half, stays or moves down
│        │  Half    │          │
│        └──────────┘          │
│                              │
│     "Swipe up to open"       │  ← Instruction
│                              │
│  (After open:)               │
│  ┌────────────────────────┐  │
│  │   [Revealed Photo      │  │
│  │    Card with caption]  │  │
│  └────────────────────────┘  │
│                              │
│  [💾 Save]  [📤 Share]  [🔄]  │  ← Action buttons
└──────────────────────────────┘
```

### 7.5 Collection Screen (`app/collection.tsx`)

```
┌──────────────────────────────┐
│  ← Back    Collection  [🔍]  │
│                              │
│  [All] [Common] [Rare] [Sp.] │  ← Rarity filter tabs
│                              │
│  ┌────┐ ┌────┐ ┌────┐       │
│  │    │ │    │ │    │       │  ← 3-column grid
│  │ C1 │ │ C2 │ │ C3 │       │
│  └────┘ └────┘ └────┘       │
│  ┌────┐ ┌────┐ ┌────┐       │
│  │ C4 │ │ C5 │ │ C6 │       │
│  └────┘ └────┘ └────┘       │
│                              │
│  (Empty state:               │
│   "No capsules yet.          │
│    Create your first!")      │
└──────────────────────────────┘
```

---

## 8. Component Catalogue

### 8.1 `GashaponMachine.tsx`

**Role:** Container that composes machine parts and hosts the animation state.

```typescript
interface GashaponMachineProps {
  phase: MachinePhase;
  capsuleColor: CapsuleColor | null;
  previewImageUri: string;
  onPhaseComplete: (phase: MachinePhase) => void;
}
```

**Renders:**
- `MachineGlass` (top dome with preview image visible inside)
- `Capsule3D` (inside the compartment, animates during drop)
- `MachineHandle` (overlaid, rotated by gesture)
- `CapsuleTray` (bottom tray, receives capsule)
- `ParticleBurst` (on reveal)

### 8.2 `MachineHandle.tsx`

```typescript
interface MachineHandleProps {
  rotation: SharedValue<number>;    // 0–360, from gesture
  isInteractive: boolean;           // false during animations
  onGestureStart: () => void;
  onGestureUpdate: (rotation: number) => void;
  onGestureEnd: (finalRotation: number) => void;
}
```

- Wraps `Gesture.Pan()` from `react-native-gesture-handler`.
- Converts pan translation to rotation angle around the handle pivot.
- Renders handle image with `useAnimatedStyle` applying `transform: [{ rotate }]`.

### 8.3 `Capsule3D.tsx`

```typescript
interface Capsule3DProps {
  color: CapsuleColor;
  size: number;                     // diameter in points
  isOpen: boolean;
  openProgress: SharedValue<number>;// 0 = closed, 1 = fully open
}
```

- Two `<View>` halves (top/bottom) with rounded caps.
- Top half translateY animates upward proportional to `openProgress`.
- Glossy highlight: a semi-transparent white gradient overlay.

### 8.4 `CapsuleCard.tsx`

```typescript
interface CapsuleCardProps {
  imageUri: string;
  caption: string | null;
  rarity: Rarity;
  capsuleColor: CapsuleColor;
  createdAt: string;
}
```

- Rendered after capsule opens.
- Card frame with rarity-coloured border.
- Image fills card interior.
- Caption below image, date in corner.

### 8.5 `ParticleBurst.tsx`

- Small confetti/starburst particles that radiate outward on reveal.
- Uses Reanimated shared values for 8–12 particles.
- Each particle: random angle, random distance (30–80 pt), random colour from rarity palette.
- Fades out over 600 ms.

### 8.6 `CollectionGrid.tsx`

```typescript
interface CollectionGridProps {
  capsules: Capsule[];
  onSelect: (capsule: Capsule) => void;
  onDelete: (capsule: Capsule) => void;
}
```

- 3-column `FlatList` with `numColumns={3}`.
- Each cell is `CapsuleThumbnail`.
- Long-press triggers delete confirmation.

---

## 9. Animation State Machine

### 9.1 State Diagram

```
idle ──(image loaded)──▶ ready
ready ──(gesture starts)──▶ turning
turning ──(rotation < 300°)──▶ turning (loop)
turning ──(rotation ≥ 300°)──▶ activated
activated ──(auto, 0ms)──▶ shaking
shaking ──(after 600ms)──▶ dispensing
dispensing ──(after 400ms)──▶ dropping
dropping ──(after 800ms)──▶ landed
landed ──(user swipe up)──▶ opening
opening ──(after 600ms)──▶ revealed
revealed ──(save done)──▶ completed
```

### 9.2 Timing Constants (all in ms)

```typescript
// src/animations/machineAnimations.ts
export const DURATIONS = {
  SHAKE: 600,
  SHAKE_CYCLE: 100,        // Each shake oscillation
  DISPENSE_INTERNAL: 400,  // Capsule moving inside machine
  DROP: 800,               // Capsule falling into tray
  TRAY_BOUNCE: 250,        // Tray settle bounce
  OPEN: 600,               // Capsule halves separating
  REVEAL: 400,             // Photo card appearing
  PARTICLE_BURST: 600,     // Confetti fade
  HANDLE_SNAP_BACK: 300,   // Handle returning to rest
};
```

### 9.3 Animation Details per Phase

#### `shaking`
- Machine body translates X: ±6 pt, 3 oscillations, easing: ease-in-out.
- Handle wiggles ±3°.
- Glass dome contents rattle (random small translations).
- Audio: `capsule-rattle.mp3`, loop 3×.

#### `dispensing`
- Internal capsule (behind glass) moves down 120 pt over 400 ms.
- Easing: ease-in (accelerates like gravity).

#### `dropping`
- Capsule falls from machine outlet to tray: ~200 pt vertical.
- Easing: cubic-bezier(0.22, 0.61, 0.36, 1) — gravity with bounce.
- On impact: tray compresses 4 pt, then springs back.

#### `opening`
- Capsule top half slides up 80 pt.
- Capsule bottom half slides down 20 pt.
- Photo card scales from 0.3 → 1.0 and fades in.
- Particle burst triggers at 50% open progress.

### 9.4 Reanimated Worklet Structure

Each animation is a function that takes `SharedValue` inputs and returns a cleanup/complete callback:

```typescript
// Pattern for each animation function
export function runDropAnimation(
  capsuleY: SharedValue<number>,
  capsuleOpacity: SharedValue<number>,
  onComplete: () => void
): void {
  capsuleY.value = withTiming(TRAY_Y, {
    duration: DURATIONS.DROP,
    easing: Easing.bezier(0.22, 0.61, 0.36, 1),
  }, (finished) => {
    if (finished) {
      runOnJS(onComplete)();
    }
  });
}
```

---

## 10. Gesture Pipeline (Handle)

### 10.1 Approach

Use a **constrained pan** gesture rather than true circular tracking for the MVP. The user drags downward or in an arc over the handle area. The gesture's horizontal + vertical displacement is mapped to a rotation angle.

### 10.2 `useHandleGesture.ts` — Full Spec

```typescript
import { Gesture } from "react-native-gesture-handler";
import {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from "react-native-reanimated";

const ROTATION_THRESHOLD = 300;     // degrees to activate
const HAPTIC_INTERVAL = 45;         // degrees between haptic ticks
const MIN_VISIBLE_ROTATION = 5;     // dead zone to prevent jitter

export function useHandleGesture(config: {
  onActivate: () => void;
  onRotationChange: (degrees: number) => void;
  enabled: boolean;
}) {
  const rotation = useSharedValue(0);
  const lastHapticTick = useSharedValue(0);

  // Track cumulative rotation, preventing backward cheating
  const gesture = Gesture.Pan()
    .enabled(config.enabled)
    .onBegin(() => {
      // Store starting point for angle calculation
    })
    .onUpdate((event) => {
      // Convert translationX/Y to an approximate rotation delta.
      // Simplified: map total drag distance to degrees.
      // 1 pt of drag ≈ 2.5° of rotation.
      const dragDistance = Math.sqrt(
        event.translationX ** 2 + event.translationY ** 2
      );
      const newRotation = Math.min(dragDistance * 2.5, 360);

      rotation.value = Math.max(0, newRotation);

      // Haptic ticks
      const tickFloor = Math.floor(newRotation / HAPTIC_INTERVAL);
      if (tickFloor > lastHapticTick.value) {
        lastHapticTick.value = tickFloor;
        runOnJS(triggerLightHaptic)();
      }

      runOnJS(config.onRotationChange)(newRotation);
    })
    .onEnd(() => {
      if (rotation.value >= ROTATION_THRESHOLD) {
        runOnJS(config.onActivate)();
      }
      // Snap back
      rotation.value = withSpring(0, { stiffness: 200, damping: 20 });
    });

  // Animated style to apply to handle View
  const handleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return { gesture, handleStyle, rotation };
}
```

### 10.3 Handle Visual Design

- Circular knob with centre spoke.
- Rendered as a PNG or SVG asset.
- Pivot point at centre of the circular base.
- Rotation origin set via `transformOrigin: "center center"` or equivalent.

### 10.4 Gesture Area

- The pan gesture is attached to the handle component itself.
- Hit area: 80×80 pt minimum for touch accessibility.
- Visual size: 60×60 pt handle on screen.

---

## 11. Capsule Randomisation Engine

### 11.1 `src/utils/randomiser.ts`

```typescript
import { CapsuleColor, Rarity } from "@models/Capsule";
import { RARITY_TABLE } from "@models/Rarity";

const CAPSULE_COLORS: CapsuleColor[] = [
  "pink", "blue", "green", "yellow", "purple", "orange", "white", "black",
];

interface RandomCapsuleParams {
  color?: CapsuleColor;   // Force a colour (for testing)
  rarity?: Rarity;        // Force a rarity (for testing)
}

export function randomCapsuleParams(
  params?: RandomCapsuleParams
): { color: CapsuleColor; rarity: Rarity } {
  // 1. Determine rarity by weighted random
  const rarity = params?.rarity ?? pickRarity();
  // 2. Pick colour, biased by rarity
  const color = params?.color ?? pickColor(rarity);
  return { color, rarity };
}

function pickRarity(): Rarity {
  const roll = Math.random() * 100; // 0–99.999...
  let cumulative = 0;
  for (const entry of RARITY_TABLE) {
    cumulative += entry.weight;
    if (roll < cumulative) return entry.rarity;
  }
  return "common"; // fallback
}

function pickColor(forRarity: Rarity): CapsuleColor {
  const config = RARITY_TABLE.find((r) => r.rarity === forRarity);
  const pool = config?.capsuleColorBias ?? CAPSULE_COLORS;
  return pool[Math.floor(Math.random() * pool.length)]!;
}
```

### 11.2 Colour-to-Hex Map

```typescript
export const CAPSULE_COLOR_HEX: Record<CapsuleColor, string> = {
  pink:    "#F48FB1",
  blue:    "#64B5F6",
  green:   "#81C784",
  yellow:  "#FFF176",
  purple:  "#CE93D8",
  orange:  "#FFB74D",
  white:   "#FAFAFA",
  black:   "#424242",
};
```

---

## 12. Sound & Haptics Map

### 12.1 Sound Triggers

| Event                     | Sound File             | Volume | Loop? | Preload? |
| ------------------------- | ---------------------- | ------ | ----- | -------- |
| Handle click (per 45°)    | `handle-click.mp3`     | 0.6    | No    | Yes      |
| Machine shake start       | `capsule-rattle.mp3`   | 0.7    | 3×    | Yes      |
| Capsule drops             | `capsule-drop.mp3`     | 0.8    | No    | Yes      |
| Capsule hits tray         | `tray-impact.mp3`      | 0.7    | No    | Yes      |
| Capsule opens             | `capsule-open.mp3`     | 0.7    | No    | Yes      |
| Photo revealed            | `reveal-chime.mp3`     | 0.9    | No    | Yes      |

### 12.2 `useSound.ts` API

```typescript
export function useSound() {
  // Preload all sounds on mount
  // Provide play(name) function
  // Respect mute setting from settingsRepository
  return {
    isMuted: boolean;
    toggleMute: () => void;
    play: (sound: SoundName) => Promise<void>;
  };
}
```

### 12.3 Haptic Triggers

| Event                     | Haptic Type          | Intensity |
| ------------------------- | -------------------- | --------- |
| Handle rotation tick       | `light`              | Low       |
| Machine activated          | `medium`             | Medium    |
| Capsule lands in tray      | `heavy`              | High      |
| Capsule opens              | `light`              | Low       |
| Particle burst             | `light` (×3 rapid)   | Low       |

### 12.4 `useHaptics.ts` API

```typescript
export function useHaptics() {
  return {
    tick: () => void;       // Light — handle rotation
    activate: () => void;   // Medium — machine trigger
    impact: () => void;     // Heavy — capsule lands
    reveal: () => void;     // Triple light — card appears
  };
}
```

---

## 13. Storage Layer

### 13.1 `src/storage/capsuleRepository.ts`

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Capsule } from "@models/Capsule";

const STORAGE_KEY = "@capsulecam/collection";
const SETTINGS_KEY = "@capsulecam/settings";

export const capsuleRepository = {
  async getAll(): Promise<Capsule[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async save(capsule: Capsule): Promise<void> {
    const all = await this.getAll();
    const existing = all.findIndex((c) => c.id === capsule.id);
    if (existing >= 0) {
      all[existing] = capsule;
    } else {
      all.unshift(capsule); // Newest first
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  },

  async delete(capsuleId: string): Promise<void> {
    const all = await this.getAll();
    const filtered = all.filter((c) => c.id !== capsuleId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  async getById(id: string): Promise<Capsule | null> {
    const all = await this.getAll();
    return all.find((c) => c.id === id) ?? null;
  },

  async getRecent(limit: number = 10): Promise<Capsule[]> {
    const all = await this.getAll();
    return all.slice(0, limit);
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
};
```

### 13.2 `src/storage/settingsRepository.ts`

```typescript
export interface AppSettings {
  isMuted: boolean;
  hasCompletedOnboarding: boolean;
  activeTheme: string;
}

const DEFAULTS: AppSettings = {
  isMuted: false,
  hasCompletedOnboarding: false,
  activeTheme: "classic_red",
};

export const settingsRepository = {
  async get(): Promise<AppSettings> { /* ... */ },
  async update(patch: Partial<AppSettings>): Promise<void> { /* ... */ },
  async reset(): Promise<void> { /* ... */ },
};
```

### 13.3 `src/storage/migrations.ts`

```typescript
// Version the storage schema.
// On app launch, check stored version; if < current, run migration functions.
const CURRENT_VERSION = 1;

export async function runMigrations(): Promise<void> {
  const version = await getStoredVersion();
  if (version < 1) {
    // Initial setup — nothing to migrate
  }
  await setStoredVersion(CURRENT_VERSION);
}
```

### 13.4 Image Storage Strategy

- Full-size image: saved to `FileSystem.documentDirectory + 'images/' + capsuleId + '.jpg'`.
- Thumbnail: 256×256 JPEG, same directory with `_thumb` suffix.
- On capsule deletion, remove both files via `FileSystem.deleteAsync()`.

---

## 14. Export & Sharing Pipeline

### 14.1 Static Export (Phase 4)

Use `react-native-view-shot` to capture a hidden `<View>` containing the export layout, then share via `expo-sharing`.

**Export layout spec (`src/utils/exportLayout.ts`):**

```
┌──────────────────────────┐
│                          │  ← 9:16 aspect (1080×1920 px)
│   [Capsule Cam logo]     │  ← Small, top-right
│                          │
│   ┌──────────────────┐   │
│   │                  │   │
│   │  Revealed Photo  │   │  ← Photo fills most of the card area
│   │  Card            │   │
│   │                  │   │
│   └──────────────────┘   │
│                          │
│   "Caption text"         │  ← Caption below card
│   📅 2025-07-23          │  ← Date
│                          │
│   💎 Rare · Blue         │  ← Rarity + colour badges
│                          │
│   #CapsuleCam            │  ← Small hashtag at bottom
└──────────────────────────┘
```

### 14.2 `useImageExport.ts` API

```typescript
export function useImageExport() {
  return {
    exportAsImage: (capsule: Capsule) => Promise<string>; // returns file URI
    shareExport: (fileUri: string) => Promise<void>;       // opens share sheet
  };
}
```

### 14.3 Video Export (post-MVP)

Not in scope for the blueprint. Requires `expo-av` recording of a view or frame-by-frame rendering — too complex for Phase 1.

---

## 15. Asset Manifest

### 15.1 Image Assets Required

| Asset                    | Dimensions | Format | Notes                              |
| ------------------------ | ---------- | ------ | ---------------------------------- |
| `machine-body.png`       | 750×1000   | PNG    | Machine body, transparent bg       |
| `handle.png`             | 200×200    | PNG    | Handle knob, transparent bg        |
| `capsule-half-top.png`   | 200×120    | PNG    | Upper capsule shell                |
| `capsule-half-bottom.png`| 200×120    | PNG    | Lower capsule shell                |
| `tray.png`               | 800×200    | PNG    | Tray with shadow                   |
| `shelf-bg.png`           | 750×1334   | PNG    | Collection shelf background        |
| `logo.png`               | 200×60     | PNG    | App logo for header + export       |
| `icon.png`               | 1024×1024  | PNG    | App icon                           |
| `splash.png`             | 1284×2778  | PNG    | Splash screen                      |

### 15.2 Sound Assets Required

| File                  | Duration | Format | Notes                        |
| --------------------- | -------- | ------ | ---------------------------- |
| `handle-click.mp3`   | 0.1s     | MP3    | Short plastic click          |
| `capsule-rattle.mp3` | 0.6s     | MP3    | Looping rattle               |
| `capsule-drop.mp3`   | 0.4s     | MP3    | Plastic object falling       |
| `tray-impact.mp3`    | 0.3s     | MP3    | Hollow plastic thud          |
| `capsule-open.mp3`   | 0.5s     | MP3    | Plastic halves separating    |
| `reveal-chime.mp3`   | 0.8s     | MP3    | Pleasant sparkle chime       |

### 15.3 Asset Sourcing

- Machine graphics: commission or use Figma to design toy-like vector illustrations.
- Export as PNG at 3× resolution for retina displays.
- Sounds: source from royalty-free libraries (e.g., Freesound, ZapSplat) or record foley (plastic container manipulation).
- All assets go into `src/assets/` and are referenced via `require()`.

---

## 16. Phase-by-Phase Build Order

### Phase 1 — Functional Prototype (Week 1–2)

**Goal:** A working loop from image selection through capsule creation on one device.

| Step | Task                                                | Files Created / Modified                               | Est. Hours |
| ---- | --------------------------------------------------- | ------------------------------------------------------ | ---------- |
| 1.1  | Scaffold Expo project with TypeScript              | `package.json`, `tsconfig.json`, `app.json`, etc.      | 0.5        |
| 1.2  | Install all core packages                           | `package.json`                                         | 0.5        |
| 1.3  | Set up path aliases in `tsconfig` + `babel`        | `tsconfig.json`, `babel.config.js`                     | 0.5        |
| 1.4  | Create type system files                            | `src/models/Capsule.ts`, `Rarity.ts`, `MachineTheme.ts`| 1.0        |
| 1.5  | Build storage layer                                 | `src/storage/capsuleRepository.ts`, `settingsRepository.ts`, `migrations.ts` | 2.0 |
| 1.6  | Build `Capsule3D` component (static, two halves)    | `src/components/Capsule3D.tsx`                         | 2.0        |
| 1.7  | Build `MachineHandle` component + gesture hook      | `src/components/MachineHandle.tsx`, `src/hooks/useHandleGesture.ts` | 4.0 |
| 1.8  | Build `GashaponMachine` component (static layout)   | `src/components/GashaponMachine.tsx`, `MachineGlass.tsx`, `CapsuleTray.tsx` | 3.0 |
| 1.9  | Build `CapsuleCard` component                       | `src/components/CapsuleCard.tsx`                       | 1.0        |
| 1.10 | Build screen shells (all 5 screens, placeholder UI) | `app/*.tsx`, `src/screens/*.tsx`                       | 3.0        |
| 1.11 | Wire navigation with Expo Router                    | `app/_layout.tsx`, all route files                     | 2.0        |
| 1.12 | Build animation state machine + hook                | `src/hooks/useCapsuleMachine.ts`, `src/animations/*.ts` | 5.0 |
| 1.13 | Wire animations into MachineScreen                  | `src/screens/MachineScreen.tsx`                        | 3.0        |
| 1.14 | Build RevealScreen (swipe-to-open capsule)          | `src/screens/RevealScreen.tsx`                         | 3.0        |
| 1.15 | Build HomeScreen (create button + recents)          | `src/screens/HomeScreen.tsx`, `CreateButton.tsx`, `RecentCapsules.tsx` | 2.0 |
| 1.16 | Build ImagePickerScreen (camera + gallery + crop)   | `src/screens/ImagePickerScreen.tsx`                     | 3.0        |
| 1.17 | Add haptics hook + wire into gesture/animation      | `src/hooks/useHaptics.ts`                              | 1.0        |
| 1.18 | End-to-end integration test (full creation flow)    | Manual testing                                          | 2.0        |
|      | **Phase 1 Total**                                   |                                                        | **38.5**   |

### Phase 2 — Interaction Polish (Week 3)

| Step | Task                                                | Files                                                    | Est. Hours |
| ---- | --------------------------------------------------- | -------------------------------------------------------- | ---------- |
| 2.1  | Replace placeholder machine with real SVG/PNG art   | `src/components/GashaponMachine.tsx`, assets              | 4.0        |
| 2.2  | Tune animation timing curves (bounce, easing)       | `src/animations/machineAnimations.ts`                    | 3.0        |
| 2.3  | Add handle resistance feel (spring back, idle sway) | `src/hooks/useHandleGesture.ts`, `src/animations/handleAnimations.ts` | 2.0 |
| 2.4  | Add sound system + preload + wire into events       | `src/hooks/useSound.ts`, all screens                     | 3.0        |
| 2.5  | Add `ParticleBurst` component                       | `src/components/ParticleBurst.tsx`, `src/animations/particleAnimations.ts` | 2.0 |
| 2.6  | Polish screen transitions                            | `src/animations/transitions.ts`                          | 1.0        |
| 2.7  | Add `RarityBadge` component                          | `src/components/RarityBadge.tsx`                         | 1.0        |
| 2.8  | Test on physical device, measure FPS                 | —                                                        | 2.0        |
|      | **Phase 2 Total**                                    |                                                          | **18.0**   |

### Phase 3 — Collection System (Week 4)

| Step | Task                                                | Files                                                    | Est. Hours |
| ---- | --------------------------------------------------- | -------------------------------------------------------- | ---------- |
| 3.1  | Build `CollectionGrid` component                    | `src/components/CollectionGrid.tsx`                      | 2.0        |
| 3.2  | Build `CapsuleThumbnail` component                  | `src/components/CapsuleThumbnail.tsx`                    | 1.5        |
| 3.3  | Build `CollectionScreen` with filter tabs           | `src/screens/CollectionScreen.tsx`                        | 3.0        |
| 3.4  | Add `CollectionContext` provider                     | `src/state/CollectionContext.tsx`                         | 1.5        |
| 3.5  | Add delete confirmation + undo                      | `src/screens/CollectionScreen.tsx`                        | 1.0        |
| 3.6  | Add empty state illustrations                        | `src/screens/CollectionScreen.tsx`                        | 1.0        |
| 3.7  | Add sort options (date, colour, rarity)              | `src/screens/CollectionScreen.tsx`                        | 1.5        |
| 3.8  | Wire reveal-from-collection flow                    | `app/reveal.tsx` + navigation                             | 1.0        |
|      | **Phase 3 Total**                                    |                                                          | **12.5**   |

### Phase 4 — Sharing (Week 5)

| Step | Task                                                | Files                                                    | Est. Hours |
| ---- | --------------------------------------------------- | -------------------------------------------------------- | ---------- |
| 4.1  | Build export layout component (hidden render)       | `src/utils/exportLayout.ts`                              | 3.0        |
| 4.2  | Implement `useImageExport` hook                      | `src/hooks/useImageExport.ts`                             | 2.0        |
| 4.3  | Build `ShareSheet` component                         | `src/components/ShareSheet.tsx`                           | 2.0        |
| 4.4  | Wire share into RevealScreen + CollectionScreen     | `src/screens/RevealScreen.tsx`, `CollectionScreen.tsx`    | 1.5        |
| 4.5  | Test export on iOS + Android share sheets            | —                                                        | 1.0        |
|      | **Phase 4 Total**                                    |                                                          | **9.5**    |

### Phase 5 — Testing & Hardening (Week 6)

| Step | Task                                                      | Est. Hours |
| ---- | --------------------------------------------------------- | ---------- |
| 5.1  | Test camera + gallery permissions flow (deny, allow, etc.)| 2.0        |
| 5.2  | Test on low-end Android device (≤ 3 GB RAM)               | 2.0        |
| 5.3  | Test on different screen sizes (iPhone SE → Pro Max)      | 2.0        |
| 5.4  | Test interrupted animations (background, lock, call)      | 1.5        |
| 5.5  | Test duplicate image handling                              | 0.5        |
| 5.6  | Test app cold start after capsule creation                | 0.5        |
| 5.7  | Test with very large images (12 MP+)                       | 1.0        |
| 5.8  | Write basic Jest smoke tests                               | 2.0        |
| 5.9  | Performance profiling (FPS, memory)                        | 1.5        |
| 5.10 | Bug bash + polish pass                                     | 3.0        |
|      | **Phase 5 Total**                                          | **16.0**   |

**Grand total estimate: ~94.5 hours** (roughly 2.5 person-weeks for a solo developer).

---

## 17. Per-File Implementation Notes

### `app/_layout.tsx`

```typescript
// Root layout — sets up:
// - GestureHandlerRootView (required by RNGH)
// - SafeAreaProvider
// - Stack navigator with screen options:
//   headerShown: false (we build custom headers)
//   animation: 'slide_from_right'
// - CollectionContext.Provider wrapping the Stack
// - Splash screen hide on mount
```

### `app/machine.tsx`

```typescript
// Route receives: { imageUri: string; caption?: string }
// Renders <MachineScreen> which consumes these params.
// This is a thin route wrapper — all logic lives in src/screens/MachineScreen.tsx
```

### `src/hooks/useCapsuleMachine.ts`

```typescript
// useReducer-based state machine.
// Reducer handles transitions: IDLE → READY → TURNING → ... → COMPLETED.
// Side effects (animations, sounds, storage) are triggered via useEffect
// watching `phase`.
// Exposes: { phase, capsule, handleRotation, dispatch }
```

### `src/components/Capsule3D.tsx`

Key implementation details:
- Two `<View>` components, each with `borderRadius` that creates a half-capsule shape.
- Top half: `borderTopLeftRadius: size/2`, `borderTopRightRadius: size/2`.
- Bottom half: `borderBottomLeftRadius: size/2`, `borderBottomRightRadius: size/2`.
- Colour applied as `backgroundColor` using `CAPSULE_COLOR_HEX`.
- Glossy effect: a nested `<View>` with a `LinearGradient` (white, opacity 0 → 0.3 → 0) overlaid.
- Separation animation: `useAnimatedStyle` on top half, `translateY: openProgress * -80`.

### `src/hooks/useHandleGesture.ts`

Key implementation details:
- Uses `Gesture.Pan()` not `Gesture.Rotation()` because rotation recogniser on RN is unreliable for arbitrary pivot points.
- The pan's `translationX` and `translationY` are fed into `Math.atan2()` to compute the angle from the handle centre.
- Cumulative rotation is tracked to prevent "cheating" by wiggling back and forth.
- Haptic ticks: `Math.floor(cumulative / 45)` compared against previous tick count.
- On end: if cumulative ≥ 300°, call `onActivate()`. Always spring back to 0.

### `src/utils/imageResizer.ts`

```typescript
import * as ImageManipulator from "expo-image-manipulator";

export async function resizeImage(uri: string): Promise<{
  fullUri: string;
  thumbnailUri: string;
}> {
  // 1. Resize to max 1024×1024 (full version)
  const full = await ImageManipulator.manipulateAsync(uri, [
    { resize: { width: 1024, height: 1024 } },
  ], { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG });

  // 2. Create 256×256 thumbnail
  const thumb = await ImageManipulator.manipulateAsync(uri, [
    { resize: { width: 256, height: 256 } },
  ], { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG });

  return { fullUri: full.uri, thumbnailUri: thumb.uri };
}
```

---

## 18. Testing Strategy

### 18.1 Unit Tests (Jest)

| Target                      | What to Test                                           |
| --------------------------- | ------------------------------------------------------ |
| `randomiser.ts`             | Weight distribution correctness, colour assignment     |
| `capsuleRepository.ts`      | CRUD operations, ordering, edge cases (empty, delete)  |
| `createCapsule()` factory   | Default values, partial overrides                      |
| `useHandleGesture` logic    | Rotation calculation from mock pan events              |
| Animation timing constants  | All durations > 0, sum of phases within expected range |

### 18.2 Integration Tests

| Flow                              | Manual Test Steps                                       |
| --------------------------------- | ------------------------------------------------------- |
| Full creation (happy path)        | Home → Capture → Take photo → Machine → Turn → Open → Save |
| Creation from gallery             | Home → Capture → Gallery → Select → Crop → Machine → ... |
| Re-open from collection           | Collection → Tap capsule → Reveal                       |
| Delete from collection            | Collection → Long press → Confirm delete                |
| Mute toggle                       | Settings → Mute → Create capsule → verify no sound       |
| Permission denied (camera)        | Deny camera → verify graceful error + link to settings   |
| Background / interrupt            | Start machine → background app → return → verify state   |
| Empty collection                  | Collection with no capsules → verify empty state UI      |

### 18.3 Device Matrix

| Device               | OS         | Screen         | Test Phase |
| -------------------- | ---------- | -------------- | ---------- |
| iPhone SE (2022)     | iOS 18     | 375×667 pt     | Phase 5    |
| iPhone 15 Pro        | iOS 18     | 393×852 pt     | Phase 1+   |
| iPhone 15 Pro Max    | iOS 18     | 430×932 pt     | Phase 5    |
| Pixel 6a             | Android 14 | 393×818 pt     | Phase 5    |
| Galaxy A14 (low-end) | Android 14 | 384×800 pt     | Phase 5    |

---

## 19. Performance Budget

| Metric                   | Target             | Measurement Tool          |
| ------------------------ | ------------------ | ------------------------- |
| App cold-start time      | ≤ 2.0 s            | Expo performance monitor  |
| Machine screen FPS       | ≥ 55 fps           | Perf monitor / dev menu   |
| Handle gesture latency   | ≤ 16 ms/frame      | Reanimated FPS counter    |
| Animation jank (dropped) | ≤ 1 frame per anim | Visual inspection         |
| Image resize time (12MP) | ≤ 1.5 s            | `console.time`            |
| Storage write time       | ≤ 100 ms           | `console.time`            |
| Memory (total, idle)     | ≤ 150 MB           | Xcode / Android Studio    |
| Memory (during machine)  | ≤ 300 MB           | Xcode / Android Studio    |
| APK / IPA size           | ≤ 50 MB            | Build output              |

### Mitigations

- **Image downscaling:** Always resize to ≤ 1024×1024 before storing.
- **Lazy sound loading:** Don't load all sounds into memory at once; stream on demand.
- **FlatList virtualisation:** Use `getItemLayout` for collection grid to reduce layout thrash.
- **Reanimated worklets:** Run animations on UI thread, never on JS thread.
- **No heavy images in animations:** Use thumbnails (256×256) inside machine glass, not full images.

---

## 20. Risk Register

| # | Risk                            | Likelihood | Impact | Mitigation                                                       | Owner      |
| - | ------------------------------- | ---------- | ------ | ---------------------------------------------------------------- | ---------- |
| 1 | Handle gesture feels wrong      | High       | High   | Start with constrained drag; A/B test with testers; fallback to tap-to-activate | Developer  |
| 2 | Animation stutter on Android    | Medium     | High   | Test on low-end Android early; use `flatten` on animated styles; reduce overdraw | Developer  |
| 3 | expo-camera lag on older phones | Medium     | Medium | Limit capture resolution; show loading state; test on Galaxy A14 | Developer  |
| 4 | AsyncStorage corruption         | Low        | High   | Add JSON parse try/catch; add schema migration; fallback to empty array | Developer  |
| 5 | Asset pipeline delay            | Medium     | Medium | Use placeholder shapes (coloured Views) before final art arrives | Designer   |
| 6 | Sound licensing issues          | Low        | Low    | Source from CC0 libraries; document all sources                   | Developer  |
| 7 | expo-sharing API differences    | Low        | Low    | Test on both platforms; provide fallback "Save to Photos" option  | Developer  |
| 8 | App Store rejection (spam)      | Low        | High   | Ensure unique value prop; no template-like UI; original assets    | Developer  |
| 9 | Scope creep                     | High       | Medium | Strict MVP scope enforcement; defer all non-Phase-1 items         | PM / Dev   |

---

## Appendix A: Colour Palette Reference

```
Primary (Classic Red Machine):
  Body:        #D32F2F
  Accent:      #FFD700
  Tray:        #424242
  Glass tint:  rgba(255,255,255,0.25)

Background Gradient:
  Top:         #1A1A2E
  Bottom:      #16213E

Capsule Colours:
  Pink:        #F48FB1
  Blue:        #64B5F6
  Green:       #81C784
  Yellow:      #FFF176
  Purple:      #CE93D8
  Orange:      #FFB74D
  White:       #FAFAFA
  Black:       #424242

Rarity Borders:
  Common:      #C0C0C0 (silver)
  Rare:        #4FC3F7 (light blue)
  Special:     #FFD700 (gold)

Text:
  Primary:     #FFFFFF (on dark bg)
  Secondary:   #B0B0B0
  Accent:      #FFD700
```

---

## Appendix B: Glossary

| Term               | Definition                                                  |
| ------------------ | ----------------------------------------------------------- |
| Capsule            | A virtual gashapon capsule containing a user's photograph   |
| Machine / Gashapon | The interactive vending machine the user operates           |
| Handle             | The rotatable knob/lever the user drags to activate         |
| Tray               | The collection area at the bottom of the machine            |
| Collectible Card   | The revealed photograph inside a decorated frame            |
| Rarity             | Cosmetic tier (Common, Rare, Special) affecting visuals     |
| Phase / State       | One discrete stage in the machine's animation state machine |

---

## Appendix C: Future Expansion Notes

Items deferred from the implementation plan, recorded here for future reference:

- **Multi-machine themes:** Store theme preference; allow user to pick machine skin.
- **Daily capsule limits:** Server-side seed for daily randomisation.
- **Friend exchanges:** QR code or deep link to share a capsule with another user.
- **Physical printing:** API integration with a print-on-demand service.
- **Location-based sets:** Use geofencing to unlock region-exclusive capsule colours.
- **Collaborative shelves:** Shared collection view between friends.
- **Home-screen widgets:** iOS widget showing latest capsule or daily prompt.
- **Video export:** Record the full machine interaction as a shareable clip.
- **Rarity stats:** Track how many of each rarity a user has collected.
- **Capsule series:** Group related capsules (e.g., "Tokyo Trip 2025") into named collections.

---

*End of Build Blueprint*
