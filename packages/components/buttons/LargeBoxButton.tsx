import React from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";

import ChevronRightSvg from "../../../assets/icons/chevron-right.svg";
import { TertiaryBox } from "../boxes/TertiaryBox";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import {
  neutral17,
  neutral22,
  neutral33,
  neutral77,
  primaryColor,
} from "@/utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export interface LargeBoxButtonProps {
  url?: string;
  buttonTitle: string;
  title: string;
  description: string;
}

export const LargeBoxButton: React.FC<LargeBoxButtonProps> = ({
  title,
  description,
  buttonTitle,
  url,
}) => {
  return (
    <Pressable
      onPress={url ? () => Linking.openURL(url) : undefined}
      style={styles.fill}
    >
      <TertiaryBox style={styles.box}>
        <View style={styles.detailContainer}>
          <BrandText>{title}</BrandText>
          <SpacerColumn size={3} />
          <BrandText style={styles.descriptionText}>{description}</BrandText>
        </View>
        <View style={styles.buttonIconTextContainer}>
          <BrandText style={styles.buttonTitleText}>{buttonTitle}</BrandText>
          <SpacerRow size={2.5} />
          <View style={styles.iconContainer}>
            <SVG source={ChevronRightSvg} />
          </View>
        </View>
      </TertiaryBox>
    </Pressable>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  box: {
    width: "100%",
    minHeight: 156,
    flexDirection: "row",
    padding: layout.spacing_x2,
    alignItems: "flex-start",
    backgroundColor: neutral17,
    borderWidth: 1,
    borderColor: neutral33,
  },
  container: {
    width: "100%",
    minHeight: 156,
    flexDirection: "row",
    padding: layout.spacing_x2,
    alignItems: "flex-start",
    backgroundColor: neutral17,
  },
  detailContainer: {
    flex: 1,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  buttonIconTextContainer: {
    flex: 1,
    alignSelf: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonTitleText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: primaryColor,
    },
  ]),
  descriptionText: StyleSheet.flatten([
    fontSemibold12,
    {
      color: neutral77,
      width: 200,
      flexWrap: "wrap",
    },
  ]),
  iconContainer: {
    width: layout.iconButton,
    height: layout.iconButton,
    borderRadius: layout.iconButton / 2,
    backgroundColor: neutral22,
    alignItems: "center",
    justifyContent: "center",
  },
});
