import React from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { fontMedium32 } from "../../utils/style/fonts";
import { GameContentView } from "./component/GameContentView";

export const RiotGameRarityScreen = () => {
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
    padding: 40,
    alignItems: "center",
  },
});
