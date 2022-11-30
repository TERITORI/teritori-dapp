import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import defaultSendToFightPNG from "../../../assets/game/default-video-send-to-fight.png";
import { BrandText } from "../../components/BrandText";
import { SpacerColumn } from "../../components/spacer";
import { fontMedium32 } from "../../utils/style/fonts";
import { GameContentView } from "./component/GameContentView";

export const RiotGameMemoriesScreen = () => {
  const { width } = useWindowDimensions();

  let numCol = 3;
  if (width < 1200) {
    numCol = 2;
  }
  if (width < 768) {
    numCol = 1;
  }

  return (
    <GameContentView>
      <View style={styles.contentContainer}>
        {/* Current season */}
        <BrandText style={fontMedium32}>The R!ot Season I</BrandText>
        <Image
          style={{ width: 516, height: 276 }}
          source={defaultSendToFightPNG}
        />

        <SpacerColumn size={8} />

        {/* Season list */}
        <BrandText style={fontMedium32}>Operation Philipp Rustov</BrandText>
        <FlatList
          data={Array(7).fill(0)}
          numColumns={numCol}
          key={numCol}
          renderItem={({ item }) => {
            return (
              <Image
                style={{
                  width: 360,
                  height: 190,
                  marginRight: 20,
                  marginBottom: 20,
                }}
                source={defaultSendToFightPNG}
              />
            );
          }}
        />
      </View>
    </GameContentView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 40,
  },
});
