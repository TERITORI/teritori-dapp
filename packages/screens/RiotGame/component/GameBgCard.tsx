import React from "react";
import { StyleSheet, Text, View } from "react-native";

import addSVG from "../../../../assets/icons/add.svg";
import { SVG } from "../../../components/SVG";
import { neutral22, neutral77 } from "../../../utils/style/colors";

interface GameBgCardProps {
  width: number;
  height: number;
  hidePlus?: boolean;
}

export const GameBgCard: React.FC<GameBgCardProps> = ({
  width,
  height,
  hidePlus,
}) => {
  return (
    <View style={[styles.card, { width, height }]}>
      <Text>GameBgCard</Text>
      {!hidePlus && (
        <View style={styles.add}>
          <SVG source={addSVG} color={neutral77} width={11} height={11} />
        </View>
      )}
    </View>
  );
};

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
    right: -5.5,
    bottom: -5.5,
  },
});
