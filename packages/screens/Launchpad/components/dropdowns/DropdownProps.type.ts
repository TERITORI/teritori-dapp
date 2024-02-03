import { ViewStyle } from "react-native";

export interface SelectionDropdownProps {
  style?: ViewStyle;
  onDropdownClosed?: () => void;
  dropdownOptions: string[];
  placeHolder?: string;
  setItem: (item: string) => void;
  item?: string;
  label: string;
}

export interface MultipleSelectionDropdownProps {
  style?: ViewStyle;
  onDropdownClosed?: () => void;
  dropdownOptions: string[];
  placeHolder?: string;
  setItems: (item: string) => void;
  items: string[];
  label: string;
  sublabel?: React.ReactElement;
}
