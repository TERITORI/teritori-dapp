import React from "react";
import { ViewStyle, View, StyleProp, TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import {
  neutral22,
  neutral33,
  secondaryColor,
  withAlpha,
} from "../../utils/style/colors";
import { fontMedium14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SecondaryBox } from "../boxes/SecondaryBox";

export const SocialButton: React.FC<{
  text?: string;
  iconSvg: React.FC<SvgProps>;
  iconColor?: string;
  textColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  noBrokenCorners?: boolean;
  height?: number;
}> = ({
  text,
  onPress,
  iconSvg,
  iconColor,
  style,
  height,
  noBrokenCorners = true,
  textColor = secondaryColor,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <SecondaryBox
        // We don't handle broken corners for now, because this button can be used on an image
        noBrokenCorners={noBrokenCorners}
        mainContainerStyle={{ backgroundColor: withAlpha(neutral22, 0.64) }}
        height={height === undefined ? 44 : height}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SecondaryBox
            noBrokenCorners={noBrokenCorners}
            style={{ marginLeft: 6 }}
            mainContainerStyle={{ backgroundColor: neutral33, borderRadius: 6 }}
            width={32}
            height={32}
            squaresBackgroundColor={withAlpha(neutral22, 0.64)}
            cornerWidth={5.5}
          >
            <SVG source={iconSvg} height={20} width={20} color={iconColor} />
          </SecondaryBox>

          {text && (
            <BrandText
              style={[
                fontMedium14,
                { marginLeft: 8, marginRight: 16, color: textColor },
              ]}
            >
              {text}
            </BrandText>
          )}
        </View>
      </SecondaryBox>
    </TouchableOpacity>
  );
};
