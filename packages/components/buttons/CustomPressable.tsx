import React from "react";
import { Pressable, PressableProps } from "react-native";

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
}

export const CustomPressable: React.FC<CustomPressableProps> = (props) => {
  return <Pressable {...props} />;
};
