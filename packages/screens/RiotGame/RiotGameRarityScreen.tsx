import { useIsFocused } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { useGame } from "../../context/GameProvider";
import { ScreenFC } from "../../utils/navigation";
import { fontMedium32 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { GameContentView } from "./component/GameContentView";
import { GameScreen } from "./types";

export const RiotGameRarityScreen: ScreenFC<GameScreen.RiotGameRarity> = () => {
  const { playGameAudio, muteAudio, enteredInGame } = useGame();
  // When this screen is focused, unmute the game audio and play game audio (A kind of forcing audio to be heard)
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused && enteredInGame) {
      muteAudio(false);
      playGameAudio();
    }
  }, [isFocused]);

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
