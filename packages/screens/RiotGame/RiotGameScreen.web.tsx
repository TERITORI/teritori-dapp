import React, { useMemo } from "react";
import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";

import { gameBgData } from "../../utils/game";
import { neutral00 } from "../../utils/style/colors";
import { headerHeight } from "../../utils/style/layout";
import { GameBgCard } from "./component/GameBgCard";
import { GameBgOverlay } from "./component/GameBgOverlay";
import { RiotGameHeader } from "./component/RiotGameHeader";

export const RiotGameScreen = () => {
  // variables
  const { width, height } = useWindowDimensions();
  const cardSize = useMemo(
    () => ({
      height: (height - headerHeight) / 5,
      width: width / 10,
    }),
    [width, height]
  );

  // returns
  return (
    <View style={styles.container}>
      <RiotGameHeader />
      {/* <View style={styles.positionRelative}> */}
      <FlatList
        data={gameBgData}
        numColumns={10}
        extraData={{ width, height }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ index }) => (
          <GameBgCard
            width={cardSize.width}
            height={cardSize.height}
            hidePlus={index >= 40 || !((index + 1) % 10)}
          />
        )}
      />
      <GameBgOverlay type="top" />
      <GameBgOverlay type="bottom" />
      <GameBgOverlay type="left" />
      <GameBgOverlay type="right" />
      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutral00,
  },
  positionRelative: {
    position: "relative",
  },
});
