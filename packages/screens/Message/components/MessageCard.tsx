import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { SvgProps } from "react-native-svg";

import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { SpacerRow } from "../../../components/spacer";
import {
  neutral00,
  neutral33,
  neutral55,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
interface CardProps {
  icon: React.FC<SvgProps>;
  text: string;
  subtext: string;
}

const MessageCard: FC<CardProps> = ({ icon, text, subtext }) => {
  return (
    <FlexRow style={styles.container}>
      <SVG source={icon} />

      <BrandText style={[fontSemibold14, { color: neutral55 }]}>
        {text}
      </BrandText>
      <SpacerRow size={1} />
      <BrandText style={[fontSemibold12, { color: secondaryColor }]}>
        {subtext}
      </BrandText>
    </FlexRow>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: layout.padding_x1,

    borderRadius: 12,
    backgroundColor: neutral00,
    borderColor: neutral33,
    borderWidth: 1,

    height: 56,
  },
});

export default MessageCard;
