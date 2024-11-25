import { Link } from "@react-navigation/native";
import React from "react";
import {
  ViewStyle,
  StyleProp,
  TouchableOpacity,
  View,
  Pressable,
  ColorValue,
} from "react-native";
import { SvgProps } from "react-native-svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { Box } from "@/components/boxes/Box";
import { withAlpha, neutral22, neutral33 } from "@/utils/style/colors";
import { fontMedium14 } from "@/utils/style/fonts";

export const iconSize = 32;
export const iconPadding = 12;
export const outerPadding = 6;
export const innerGap = 8;

const IconWithText: React.FC<{
  text?: string;
  iconSvg: React.FC<SvgProps>;
  textColor?: ColorValue;
  iconColor?: ColorValue;
}> = ({ text, iconSvg, textColor, iconColor }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Box
        style={{
          backgroundColor: neutral33,
          borderRadius: 6,
          width: iconSize,
          height: iconSize,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SVG
          source={iconSvg}
          height={iconSize - iconPadding}
          width={iconSize - iconPadding}
          color={iconColor || "white"}
        />
      </Box>
      {!!text && (
        <BrandText
          style={[
            fontMedium14,
            { marginLeft: innerGap },
            !!textColor && { color: textColor },
          ]}
        >
          {text}
        </BrandText>
      )}
    </View>
  );
};

export const IconWithTextButton: React.FC<{
  text?: string;
  iconSvg: React.FC<SvgProps>;
  textColor?: ColorValue;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ text, iconSvg, style, onPress, textColor }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <Pressable
      style={style}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      <IconWithText
        text={text}
        textColor={hovered ? "white" : textColor}
        iconSvg={iconSvg}
      />
    </Pressable>
  );
};

export const SocialButton: React.FC<{
  text?: string;
  iconSvg: React.FC<SvgProps>;
  textColor?: ColorValue;
  iconColor?: ColorValue;
  onPress?: () => void;
  link?: string;
  style?: StyleProp<ViewStyle>;
}> = ({ text, onPress, link, iconSvg, style, textColor, iconColor }) => {
  const content = (
    <Box
      style={{
        paddingVertical: outerPadding,
        backgroundColor: withAlpha(neutral22, 0.64),
        paddingLeft: outerPadding,
        paddingRight: outerPadding + (text ? innerGap : 0),
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <IconWithText
        text={text}
        textColor={textColor}
        iconColor={iconColor}
        iconSvg={iconSvg}
      />
    </Box>
  );
  if (link) {
    return <Link to={link}>{content}</Link>;
  }
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      {content}
    </TouchableOpacity>
  );
};
