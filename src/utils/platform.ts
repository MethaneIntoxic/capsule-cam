// src/utils/platform.ts
// Web detection helper used to guard native-only modules during export.

import { Platform } from "react-native";

export const isWeb = Platform.OS === "web";
export const isNative = !isWeb;
