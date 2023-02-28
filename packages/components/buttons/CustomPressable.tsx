import React from "react";
import { Pressable, PressableProps } from "react-native";

// Pressable from default doesn't support hovered and focused states this state is added by react-native-web.
// hence this hack for typescript support.
type PressableState = Readonly<{
  pressed: boolean;
  hovered?: boolean;
  focused?: boolean;
}>;

interface CustomPressableProps extends Omit<PressableProps, "Children"> {
  children?:
    | React.ReactNode
    | ((state: PressableState) => React.ReactNode)
    | undefined;
  onHoverIn?: (e: MouseEvent) => void;
  onHoverOut?: (e: MouseEvent) => void;
}

export const CustomPressable: React.FC<CustomPressableProps> = (props) => {
  return <Pressable {...props} />;
};
