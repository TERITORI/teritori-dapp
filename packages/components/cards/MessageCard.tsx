import React, { FC } from "react";
import { Text, StyleSheet } from "react-native";

import {
  neutral00,
  neutral33,
  neutral55,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../utils/style/fonts";
import FlexRow from "../FlexRow";
import { SpacerRow } from "../spacer";
interface CardProps {
  icon: React.ReactNode;
  text: string;
  subtext: string;
}

const MessageCard: FC<CardProps> = ({
  icon,
  text,

  subtext,
}) => {
  const SVG: any = icon;

  return (
    <FlexRow style={styles.container}>
      <SVG source={icon} />

      <Text style={[fontSemibold14, { color: neutral55 }]}>{text}</Text>
      <SpacerRow size={1} />
      <Text style={[fontSemibold12, { color: secondaryColor }]}>{subtext}</Text>
    </FlexRow>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 16,
    paddingLeft: 6,
    paddingRight: 10,
    borderRadius: 12,
    backgroundColor: neutral00,
    borderColor: neutral33,
    borderWidth: 1,

    height: 56,
  },
});

export default MessageCard;
