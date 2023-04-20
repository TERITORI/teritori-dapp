import React from "react";
import { Pressable, StyleSheet, Image, View } from "react-native";

import { DaoInfo } from "../../../api/dao/v1/dao";
import { BrandText } from "../../../components/BrandText";
import { SpacerColumn } from "../../../components/spacer";
import {
  neutral17,
  neutral33,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";
interface DaoItemProps {
  info: DaoInfo;
  onPress?: () => void;
}

export const DaoItem: React.FC<DaoItemProps> = ({ info, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Image source={{ uri: info.imageUrl }} style={styles.imageStyle} />
        <SpacerColumn size={2.5} />
        <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
          {info.name}
        </BrandText>
      </View>
      <SpacerColumn size={2.5} />
      <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
        {info.description}
      </BrandText>
      <SpacerColumn size={2.5} />
      <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
        {tinyAddress(info.address, 16)}
      </BrandText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 300,
    flexDirection: "column",
    paddingTop: layout.padding_x2_5,
    paddingBottom: layout.padding_x4,
    paddingHorizontal: layout.padding_x2_5,
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
  imageStyle: {
    width: 100,
    height: 100,
    borderRadius: 9999,
    padding: 4,
  },
});
