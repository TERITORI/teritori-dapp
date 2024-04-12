import { Dispatch, SetStateAction } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { LocalFileData } from "../../../utils/types/files";

import { BoxStyle } from "@/components/boxes/Box";

export interface FileUploaderSmallProps {
  onUpload: (files: LocalFileData[]) => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
  nbAddedFiles: number;
  multiple?: boolean;
  mimeTypes: string[];
  maxUpload?: number;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
  required?: boolean;
  boxStyle?: StyleProp<BoxStyle>;
}
