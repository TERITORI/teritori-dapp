import { FC } from "react";
import { ColorValue } from "react-native";

import locationRefinedSVG from "@/assets/icons/location-refined.svg";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { useDeveloperMode } from "@/hooks/useDeveloperMode";
import { neutralFF } from "@/utils/style/colors";

export const LocationButton: FC<{
  onPress: () => void;
  color?: ColorValue;
  disabled?: boolean;
}> = ({ onPress, color = neutralFF, disabled = false }) => {
  const [developerMode] = useDeveloperMode();

  if (!developerMode) return null;
  return (
    <CustomPressable onPress={onPress} disabled={disabled}>
      <SVG source={locationRefinedSVG} height={20} width={20} color={color} />
    </CustomPressable>
  );
};
