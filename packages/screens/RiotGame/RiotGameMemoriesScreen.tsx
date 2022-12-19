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
import { EmbeddedWeb } from "../../components/EmbeddedWeb";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { SpacerColumn } from "../../components/spacer";
import { fontMedium32 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { GameContentView } from "./component/GameContentView";

const embeddedVideoUri = "https://www.youtube.com/embed/fh-e3zArVE4";
const embeddedVideoHeight = 283;
const embeddedVideoWidth = 527;
const embeddedVideoSmHeight = 245;
const embeddedVideoSmWidth = 430;

//TODO: Type and fetch this dynamically
const episodes = [
  {
    videoUri:
      "https://bafybeieid23jjpzug42y6u5au2noc6hpyayqd56udgvh7pfd45jeksykoe.ipfs.nftstorage.link/",
  },
  { videoUri: "" },
  { videoUri: "" },
  { videoUri: "" },
  { videoUri: "" },
  { videoUri: "" },
];

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
        <BrandText style={[fontMedium32, styles.title]}>
          The R!ot Season I
        </BrandText>
        <TertiaryBox
          height={embeddedVideoHeight - 2}
          width={embeddedVideoWidth}
        >
          <EmbeddedWeb
            uri={embeddedVideoUri}
            width={embeddedVideoWidth}
            height={embeddedVideoHeight}
          />
        </TertiaryBox>

        <SpacerColumn size={8} />

        {/* Season list */}
        <BrandText style={[fontMedium32, styles.title]}>
          Operation Philipp Rustov
        </BrandText>
        <FlatList
          data={episodes}
          numColumns={numCol}
          key={numCol}
          renderItem={({ item, index }) => (
            <TertiaryBox
              key={index}
              height={embeddedVideoSmHeight - 2}
              width={embeddedVideoSmWidth}
              style={styles.videoSmBox}
            >
              {item.videoUri ? (
                <EmbeddedWeb
                  uri={item.videoUri}
                  width={embeddedVideoSmWidth}
                  height={embeddedVideoSmHeight}
                />
              ) : (
                <Image
                  style={styles.videoSmImageFallback}
                  source={defaultSendToFightPNG}
                />
              )}
            </TertiaryBox>
          )}
        />
      </View>
    </GameContentView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: layout.padding_x4,
  },
  videoSmBox: {
    marginRight: layout.padding_x2_5,
    marginBottom: layout.padding_x2_5,
  },
  videoSmImageFallback: {
    height: "100%",
    width: "100%",
    borderRadius: 7,
  },
  title: {
    marginBottom: layout.padding_x2,
  },
});
