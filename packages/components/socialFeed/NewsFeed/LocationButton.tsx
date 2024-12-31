import { FC } from "react";
import { ColorValue, StyleProp, ViewStyle } from "react-native";
import { MouseEvent } from "react-native/Libraries/Types/CoreEventTypes";

import locationRefinedSVG from "@/assets/icons/location-refined.svg";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";

export const LocationButton: FC<{
  onPress: () => void;
  color?: ColorValue;
  stroke?: ColorValue;
  style?: StyleProp<ViewStyle>;
  onHoverIn?: (event: MouseEvent) => void;
  onHoverOut?: (event: MouseEvent) => void;
}> = ({ onPress, stroke, color, style, onHoverIn, onHoverOut }) => {
  return (
    <CustomPressable
      onPress={onPress}
      style={style}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
    >
      <SVG
        source={locationRefinedSVG}
        height={20}
        width={20}
        color={color}
        stroke={stroke}
      />
    </CustomPressable>
  );
};
