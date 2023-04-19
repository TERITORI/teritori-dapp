import React from "react";
import { ViewStyle, View, StyleProp, TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { neutral00, neutral22, neutral77 } from "../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const FlowCard: React.FC<{
  label: string;
  description: string;
  iconSVG: React.FC<SvgProps>;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  disabled?: boolean;
}> = ({ label, description, iconSVG, style, disabled, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[{ flex: 1 }, style]}
    >
      <TertiaryBox
        height={224}
        fullWidth
        mainContainerStyle={{
          paddingVertical: 20,
          paddingHorizontal: 20,
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: disabled ? neutral22 : neutral00,
        }}
        disabled={disabled}
      >
        <SVG width={40} height={40} source={iconSVG} />
        <View>
          <BrandText
            style={[
              fontSemibold14,
              {
                color: neutral77,
                marginBottom: 14,
              },
            ]}
          >
            {description}
          </BrandText>
          <BrandText style={[fontSemibold20]}>{label}</BrandText>
        </View>
        <View
          style={{
            height: 32,
            width: 32,
            backgroundColor: neutral22,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            position: "absolute",
            right: 18,
            bottom: 18,
          }}
        >
          <SVG source={chevronRightSVG} width={16} />
        </View>
      </TertiaryBox>
    </TouchableOpacity>
  );
};
