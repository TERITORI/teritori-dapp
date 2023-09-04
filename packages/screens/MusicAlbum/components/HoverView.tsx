import React, { useState } from "react";
import { ViewStyle } from "react-native";

import { CustomPressable } from "../../../components/buttons/CustomPressable";

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
    <CustomPressable
      onHoverIn={() => setHoverState(true)}
      onHoverOut={() => setHoverState(false)}
      style={hoverState ? hoverStyle : normalStyle}
      onPress={onPress}
    >
      {children}
    </CustomPressable>
  );
};
