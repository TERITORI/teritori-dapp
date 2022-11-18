import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { SvgProps } from "react-native-svg";

import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import {
  neutral17,
  neutral33,
  neutral55,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface GetStartedOptionProps {
  icon: React.FC<SvgProps>;
  title: string;
  onPress?: () => void;
}

export const GetStartedOption: React.FC<GetStartedOptionProps> = ({
  icon,
  title,
  onPress,
}) => {
  const isComingSoon = onPress === undefined;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        { borderColor: isComingSoon ? neutral17 : neutral33 },
      ]}
    >
      {isComingSoon && (
        <BrandText style={styles.comingSoonText}>coming soon</BrandText>
      )}

      <SVG source={icon} width={80} height={80} />
      <BrandText
        style={[
          fontSemibold14,
          { color: isComingSoon ? neutral55 : secondaryColor },
        ]}
      >
        {title}
      </BrandText>
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
  comingSoonText: StyleSheet.flatten([
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
