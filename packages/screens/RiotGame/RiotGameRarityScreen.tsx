import React from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { useOnGameFocus } from "../../context/GameProvider";
import { fontMedium32 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { GameContentView } from "./component/GameContentView";

export const RiotGameRarityScreen = () => {
  useOnGameFocus();

  return (
    <GameContentView>
      <View style={styles.contentContainer}>
        <BrandText style={fontMedium32}>Coming soon...</BrandText>
      </View>
    </GameContentView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: layout.padding_x4,
    alignItems: "center",
  },
});
