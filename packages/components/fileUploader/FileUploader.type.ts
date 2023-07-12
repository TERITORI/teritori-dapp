import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import { LocalFileData } from "../../utils/types/feed";

export interface FileUploaderProps {
  onUpload: (files: LocalFileData[]) => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
  isImageCover?: boolean;
  fileHeight?: number;
  multiple?: boolean;
  mimeTypes?: string[];
  children?: ({ onPress }: { onPress: () => void }) => React.ReactNode;
  maxUpload?: number;
}
