import { ViewStyle } from "react-native";

export interface DurationDropdownProps {
  style?: ViewStyle;
  onDropdownClosed?: () => void;
  setItem: (item: string) => void;
  item?: string;
}
