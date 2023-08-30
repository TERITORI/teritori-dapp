import React, { useCallback } from "react";
import { Image, StyleSheet, View } from "react-native";

import addSVG from "../../../../assets/icons/add.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { neutral22, neutral77, neutralA3 } from "../../../utils/style/colors";
import { fontBold12, fontSemibold28 } from "../../../utils/style/fonts";
import { GameBgCardItem } from "../types";

interface GameBgCardProps {
  width: number;
  height: number;
  hidePlus?: boolean;
  item: GameBgCardItem;
}

export const GameBgCard: React.FC<GameBgCardProps> = ({
  width,
  height,
  hidePlus,
  item,
}) => {
  //  returns
  const renderCard = useCallback(() => {
    switch (item.type) {
      case "POINTS":
        return (
          <View style={styles.insideCard}>
            <BrandText style={styles.pointLabel}>{item.data.label}</BrandText>
            <BrandText style={fontSemibold28}>{item.data.value}</BrandText>
          </View>
        );

      case "IMAGE":
        return <Image source={item.data.source} style={{ width, height }} />;

      case "ICON":
        return <SVG source={item.data.source} width={40} height={40} />;
      default:
        return null;
    }
  }, [item.type, item.data, width, height]);

  return (
    <View style={[styles.card, { width, height }]}>
      {renderCard()}
      {!hidePlus && (
        <View style={styles.add}>
          <SVG source={addSVG} color={neutral77} width={11} height={11} />
        </View>
      )}
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  card: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: neutral22,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  add: {
    position: "absolute",
    left: -5.5,
    top: -5.5,
    zIndex: 1000,
  },
  insideCard: { flex: 1, justifyContent: "center", alignItems: "center" },
  pointLabel: StyleSheet.flatten([
    fontBold12,
    { color: neutralA3, textTransform: "uppercase" },
  ]),
});
