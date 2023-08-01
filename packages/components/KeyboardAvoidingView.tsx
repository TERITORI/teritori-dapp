import React from "react";
import {
  Platform,
  KeyboardAvoidingView as KeyboardAvoiding,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MOBILE_HEADER_HEIGHT } from "../utils/style/layout";

interface KeyboardAvoidingViewProps {
  extraVerticalOffset?: number;
  children: React.ReactNode;
}

export const KeyboardAvoidingView = ({
  extraVerticalOffset = 0,
  children,
}: KeyboardAvoidingViewProps) => {
  const insets = useSafeAreaInsets();

  if (Platform.OS === "web") {
    return children;
  }

  return (
    <KeyboardAvoiding
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={
        insets.top +
        insets.bottom +
        MOBILE_HEADER_HEIGHT -
        20 +
        extraVerticalOffset
      }
    >
      {children}
    </KeyboardAvoiding>
  );
};
