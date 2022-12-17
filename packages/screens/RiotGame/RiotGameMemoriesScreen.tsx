import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import defaultSendToFightPNG from "../../../assets/game/default-video-send-to-fight.png";
import { BrandText } from "../../components/BrandText";
import { SpacerColumn } from "../../components/spacer";
import { useAppNavigation } from "../../utils/navigation";
import { fontMedium32 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { GameContentView } from "./component/GameContentView";

export const RiotGameMemoriesScreen = () => {
  const navigation = useAppNavigation();
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
        <TouchableOpacity onPress={() => navigation.navigate("RiotGameEnroll")}>
          <Image
            style={{ width: 516, height: 276 }}
            source={defaultSendToFightPNG}
          />
        </TouchableOpacity>

        <SpacerColumn size={8} />

        {/* Season list */}
        <BrandText style={fontMedium32}>Operation Philipp Rustov</BrandText>
        <FlatList
          data={Array(7).fill(0)}
          numColumns={numCol}
          key={numCol}
          renderItem={({ item, index }) => {
            return (
              <Image
                key={index}
                style={styles.memoryImage}
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
    padding: layout.padding_x4,
  },
  memoryImage: {
    width: 360,
    height: 190,
    marginRight: layout.padding_x2_5,
    marginBottom: layout.padding_x2_5,
  },
});
