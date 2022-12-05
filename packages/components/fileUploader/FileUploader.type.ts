import { ViewStyle } from "react-native";

export interface FileUploaderProps {
  label?: string;
  style?: ViewStyle;
  onUpload: (files: File[] | FileList) => void;
  multiple?: boolean;
  mimeTypes?: string[];
  triggerFileUpload?: boolean;
}
