import React, { useState } from "react";
import { Pressable, ViewStyle } from "react-native";

interface HoverViewProps {
  normalStyle: ViewStyle;
  hoverStyle: ViewStyle;
  onPress?: () => void;
}

export const HoverView: React.FC<HoverViewProps> = ({
  normalStyle,
  hoverStyle,
  children,
  onPress = () => {},
}) => {
  const [hoverState, setHoverState] = useState<boolean>(false);

  return (
    <Pressable
      // is required to ignore the following to fix a problem with the linter
      // and allow to use onClick in this special case
      // @ts-ignore
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
      style={hoverState ? hoverStyle : normalStyle}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};
