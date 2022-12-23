import React from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { fontMedium32 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { GameContentView } from "./component/GameContentView";
import {ScreenFC} from "../../utils/navigation";
import {GameScreen} from "./types";

export const RiotGameRarityScreen: ScreenFC<GameScreen.RiotGameRarity> = () => {
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
