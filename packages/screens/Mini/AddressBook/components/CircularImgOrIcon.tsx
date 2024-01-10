import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { SVGorImageIcon } from "../../../../components/SVG/SVGorImageIcon";
import { neutral22 } from "../../../../utils/style/colors";

type CircularBoxType = {
  size?: number;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  icon?: React.FC<SvgProps> | string;
  enableFullIcon?: boolean;
};

export default function CircularImgOrIcon({
  size,
  backgroundColor,
  style,
  icon,
  enableFullIcon,
}: CircularBoxType) {
  const boxSize = size ?? 150;

  return (
    <View
      style={[
        {
          width: boxSize,
          height: boxSize,
          backgroundColor: backgroundColor ?? "#000",
          borderRadius: boxSize / 2,
          borderWidth: 2,
          borderColor: neutral22,
        },
        style,
      ]}
    >
      {icon && (
        <SVGorImageIcon
          icon={icon}
          iconSize={enableFullIcon ? boxSize : boxSize / 2}
          style={{ borderRadius: boxSize / 2 }}
        />
      )}
    </View>
  );
}
