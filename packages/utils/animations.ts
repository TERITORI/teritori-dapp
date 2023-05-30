import { Platform } from "react-native";

export const shouldUseNativeDriver = Platform.OS !== "web";
