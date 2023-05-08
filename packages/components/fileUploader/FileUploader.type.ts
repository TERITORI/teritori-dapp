import React from "react";
import { ViewStyle } from "react-native";

import { LocalFileData } from "../../utils/types/feed";

export interface FileUploaderProps {
  label?: string;
  style?: ViewStyle;
  onUpload: (files: LocalFileData[]) => void;
  multiple?: boolean;
  mimeTypes?: string[];
  children?: ({ onPress }: { onPress: () => void }) => React.ReactNode;
  maxUpload?: number;
}
