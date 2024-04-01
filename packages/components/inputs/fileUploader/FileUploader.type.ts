import React, { CSSProperties } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { LocalFileData } from "../../../utils/types/files";

export interface FileUploaderProps {
  defaultFile?: string;
  onUpload: (files: LocalFileData[]) => Promise<void> | void;
  label?: string;
  style?: StyleProp<ViewStyle>;
  fileImageStyle?: CSSProperties;
  multiple?: boolean;
  mimeTypes?: string[];
  children?: ({ onPress }: { onPress: () => void }) => React.ReactNode;
  maxUpload?: number;
  setIsLoading?: (value: boolean) => void;
}
