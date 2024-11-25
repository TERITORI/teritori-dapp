import { NativeSyntheticEvent, TextInputKeyPressEventData } from "react-native";

export const handleKeyPress = ({
  event,
  onPressEnter,
}: {
  event: NativeSyntheticEvent<TextInputKeyPressEventData>;
  onPressEnter?: () => void;
}) => {
  const {
    nativeEvent: { key: keyValue },
  } = event;
  switch (keyValue) {
    case "Enter":
      if (onPressEnter) onPressEnter();
  }
};
