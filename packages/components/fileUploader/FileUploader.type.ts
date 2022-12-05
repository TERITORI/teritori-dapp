import { ViewStyle } from "react-native";

export interface FileUploaderProps {
  value?: File;
  label?: string;
  style?: ViewStyle;
  onUpload: (files: File[] | FileList) => void;
  multiple?: boolean;
  mimeTypes?: string[];
  triggerFileUpload?: boolean;
  onTrigger?: () => void;
}
