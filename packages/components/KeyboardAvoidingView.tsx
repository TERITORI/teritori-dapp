import React from "react";
import {
  Platform,
  KeyboardAvoidingView as KeyboardAvoiding,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MOBILE_HEADER_HEIGHT } from "../utils/style/layout";

export const KeyboardAvoidingView: React.FC = ({ children }) => {
  const insets = useSafeAreaInsets();

  if (Platform.OS === "web") {
    return children;
  }

  return (
    <KeyboardAvoiding
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={
        insets.top + insets.bottom + MOBILE_HEADER_HEIGHT - 20
      }
    >
      {children}
    </KeyboardAvoiding>
  );
};
