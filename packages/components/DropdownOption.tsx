import React from "react";
import { StyleSheet } from "react-native";
import { SvgProps } from "react-native-svg";

import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { CustomPressable } from "./buttons/CustomPressable";
import { SpacerRow } from "./spacer";
import { secondaryColor } from "../utils/style/colors";
import { fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";

interface DropdownOptionProps {
  icon: React.FC<SvgProps>;
  label: string;
  onPress?: () => void;
  isComingSoon?: boolean;
}

export const DropdownOption: React.FC<DropdownOptionProps> = ({
  icon,
  label,
  onPress,
  isComingSoon,
}) => {
  return (
    <CustomPressable
      style={[styles.option, isComingSoon && styles.comingSoon]}
      onPress={onPress}
    >
      {({ hovered }) => (
        <>
          <SVG source={icon} width={20} height={20} color={secondaryColor} />
          <SpacerRow size={1.5} />
          <BrandText style={fontSemibold14}>
            {hovered && isComingSoon ? "Coming Soon" : label}
          </BrandText>
        </>
      )}
    </CustomPressable>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    padding: layout.spacing_x1,
  },
  comingSoon: { opacity: 0.5 },
});
