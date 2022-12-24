import React from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { useGame } from "../../context/GameProvider";
import { ScreenFC } from "../../utils/navigation";
import { fontMedium32 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { GameContentView } from "./component/GameContentView";
import { GameScreen } from "./types";

export const RiotGameRarityScreen: ScreenFC<GameScreen.RiotGameRarity> = () => {
  const { playGameAudio, stopMemoriesVideos } = useGame();
  return (
    <GameContentView>
      <View
        style={styles.contentContainer}
        onLayout={() => {
          stopMemoriesVideos();
          playGameAudio();
        }}
      >
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
