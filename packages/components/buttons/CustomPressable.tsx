import React from "react";
import {
  Pressable,
  PressableProps,
  NativeSyntheticEvent,
  NativeMouseEvent,
} from "react-native";

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
  onHoverIn?: (e: NativeSyntheticEvent<NativeMouseEvent>) => void;
  onHoverOut?: (e: NativeSyntheticEvent<NativeMouseEvent>) => void;
}

export const CustomPressable: React.FC<CustomPressableProps> = (props) => {
  //@ts-ignore
  return <Pressable {...props} />;
};
