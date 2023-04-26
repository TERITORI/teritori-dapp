import React, { FC } from "react";
import { Text, StyleSheet, StyleProp, ViewStyle } from "react-native";

import {
  neutral00,
  neutral17,
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
      <SVG source={icon} height={30} width={30} />
      <SpacerRow size={1} />
      <Text style={[fontSemibold14, { color: neutral55 }]}>{text}</Text>
      <SpacerRow size={1} />
      <Text style={[fontSemibold12, { color: secondaryColor }]}>{subtext}</Text>
    </FlexRow>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: neutral00,
    borderColor: neutral17,
    borderWidth: 1,

    height: 54,
  },
});

export default MessageCard;
