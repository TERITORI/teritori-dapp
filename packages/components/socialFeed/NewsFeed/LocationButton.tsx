import { FC } from "react";
import { ColorValue } from "react-native";

import locationRefinedSVG from "@/assets/icons/location-refined.svg";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";

export const LocationButton: FC<{
  onPress: () => void;
  color?: ColorValue;
  stroke?: ColorValue;
}> = ({ onPress, stroke, color }) => {
  return (
    <CustomPressable onPress={onPress}>
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
