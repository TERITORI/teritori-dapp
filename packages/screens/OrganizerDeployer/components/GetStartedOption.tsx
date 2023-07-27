import React from "react";
import { Pressable, StyleSheet, TextStyle, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn } from "../../../components/spacer";
import {
  neutral17,
  neutral33,
  neutral55,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold14,
  fontSemibold9,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface GetStartedOptionProps {
  variant?: "big" | "small";
  icon: React.FC<SvgProps>;
  title: string;
  subtitle?: string;
  isBetaVersion?: boolean;
  titleStyle?: TextStyle;
  onPress?: () => void;
  disabled?: boolean;
}

export const GetStartedOption: React.FC<GetStartedOptionProps> = ({
  variant,
  icon,
  title,
  onPress,
  isBetaVersion,
  subtitle,
  titleStyle,
  disabled,
}) => {
  const styleDarker = onPress === undefined || isBetaVersion;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        { borderColor: styleDarker ? neutral17 : neutral33 },
        variant === "small" && styles.smallContainer,
      ]}
    >
      {styleDarker && (
        <BrandText style={styles.topText}>
          {isBetaVersion ? "Beta Version" : "coming soon"}
        </BrandText>
      )}

      <SVG source={icon} width={80} height={80} />
      <View>
        <BrandText
          style={[
            fontSemibold14,
            { color: styleDarker ? neutral55 : secondaryColor },
            variant === "small" && styles.smallText,
            titleStyle,
          ]}
        >
          {title}
        </BrandText>
        <SpacerColumn size={1} />
        {subtitle && (
          <BrandText
            style={[
              fontSemibold9,
              { color: neutral55 },
              variant === "small" && styles.smallText,
            ]}
          >
            {subtitle}
          </BrandText>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 200,
    paddingTop: layout.padding_x2_5,
    paddingBottom: layout.padding_x4,
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: neutral33,
    position: "relative",
    borderRadius: 12,
    marginHorizontal: layout.padding_x2,
    marginVertical: layout.padding_x2,
  },
  smallContainer: {
    width: 135,
    height: 160,
    paddingBottom: layout.padding_x1_5,
    marginVertical: 0,
  },
  smallText: { textAlign: "center" },
  topText: StyleSheet.flatten([
    fontSemibold12,
    {
      position: "absolute",
      top: 0,
      right: 0,
      padding: layout.padding_x0_5,
      paddingHorizontal: layout.padding_x1,
      borderBottomLeftRadius: 12,
      borderTopRightRadius: 12,
      backgroundColor: neutral17,
    },
  ]),
});
