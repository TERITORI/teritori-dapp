import React, { CSSProperties, Dispatch, SetStateAction } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { LocalFileData } from "../../utils/types/files";

export interface FileUploaderProps {
  onUpload: (files: LocalFileData[]) => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
  fileImageStyle?: CSSProperties;
  multiple?: boolean;
  mimeTypes?: string[];
  children?: ({ onPress }: { onPress: () => void }) => React.ReactNode;
  maxUpload?: number;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
}
