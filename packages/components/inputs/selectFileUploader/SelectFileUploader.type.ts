import React, { Dispatch, SetStateAction } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { LocalFileData } from "../../../utils/types/files";

export interface SelectFileUploaderProps {
  onUpload: (files: LocalFileData[]) => void;
  files?: LocalFileData[];
  label?: string;
  style?: StyleProp<ViewStyle>;
  isImageCover?: boolean;
  fileHeight?: number;
  multiple?: boolean;
  mimeTypes?: string[];
  children?: ({ onPress }: { onPress: () => void }) => React.ReactNode;
  maxUpload?: number;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
  containerHeight?: number;
  isRequired?: boolean;
}
