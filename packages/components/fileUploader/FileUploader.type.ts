import React from "react";
import { ViewStyle } from "react-native";

export interface FileUploaderProps {
  label?: string;
  style?: ViewStyle;
  onUpload: (files: File[]) => void;
  multiple?: boolean;
  mimeTypes?: string[];
  children?: ({ onPress }: { onPress: () => void }) => React.ReactNode;
}
