import React from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";

import { neutral17 } from "../../../utils/style/colors";
import { TertiaryBox } from "../../boxes/TertiaryBox";

export const NavbarCard: React.FC<{
  width?: number;
  height?: number;
  onPress?: () => void;
  squaresBackgroundColor?: string;
  backgroundColor?: string;
  color?: string;
  iconSVG?: React.FC<SvgProps>;
  disabled?: boolean;
  fullWidth?: boolean;
  children?: JSX.Element | JSX.Element[];
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  height,
  children,
}) => {
  return (
    <TertiaryBox
      width={width}
      height={height}
      mainContainerStyle={{ backgroundColor: neutral17 }}
    >
      {children && (
        <View style={{ width: "100%" }}>
          {/*------- Modal main content */}
          {/* {hideMainSeparator !== true && ( */}
          {children}
        </View>
      )}
    </TertiaryBox>
  );
};
