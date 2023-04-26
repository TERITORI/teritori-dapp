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
      style={hoverState ? hoverStyle : normalStyle}
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};
