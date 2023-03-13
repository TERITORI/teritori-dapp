import { useIsFocused } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
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
import { layout, mobileWidth } from "../../utils/style/layout";
import { GameContentView } from "./component/GameContentView";

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
  const episodesVideosRefs = useRef<Video[]>([]);
  const [displayYT, setDisplayYT] = useState(false);
  const isScreenFocused = useIsFocused();

  const seasonVideoUri =
    "https://www.youtube.com/embed/videoseries?list=PLRcO8OPsbd7zhj7PDysX2XIh095tazSWM";
  const seasonVideoWidth = width < mobileWidth ? width - 64 : 516;
  const seasonVideoHeight = Math.floor((seasonVideoWidth * 9) / 16);
  const episodeVideoSmWidth = width < mobileWidth ? width - 64 : 430;
  const episodeVideoSmHeight = Math.floor(
    ((episodeVideoSmWidth - 2) * 9) / 16 + 2
  );

  // Stop videos when changing screen through react-navigation
  useEffect(() => {
    if (!isScreenFocused) {
      setDisplayYT(false);

      episodesVideosRefs.current.map(async (video) => {
        if (video) {
          const status = await video.getStatusAsync();
          if (status.isLoaded && status.isPlaying) video.pauseAsync();
        }
      });
    }
  }, [isScreenFocused]);

  let numCol = 3;
  if (width < 1200) {
    numCol = 2;
  }
  if (width < 768) {
    numCol = 1;
  }

  const styles = StyleSheet.create({
    contentContainer: {
      padding: layout.padding_x4,
    },
    videoSmBox: {
      margin: "auto",
      marginRight: width < mobileWidth ? undefined : layout.padding_x2_5,
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

  return (
    <GameContentView>
      <View style={styles.contentContainer} onLayout={() => setDisplayYT(true)}>
        {/* Current season */}
        <BrandText style={[fontMedium32, styles.title]}>
          The R!ot Season I
        </BrandText>
        <TertiaryBox height={seasonVideoHeight} width={seasonVideoWidth}>
          {displayYT && (
            <EmbeddedWeb
              uri={seasonVideoUri}
              width={seasonVideoWidth - 2}
              height={seasonVideoHeight - 2}
            />
          )}
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
              height={episodeVideoSmHeight - 2}
              width={episodeVideoSmWidth}
              // mainContainerStyle={{ width: "20%" }}
              style={styles.videoSmBox}
            >
              {item.videoUri ? (
                <Video
                  ref={(item: Video) => episodesVideosRefs.current.push(item)}
                  style={{
                    borderRadius: 7,
                    width: episodeVideoSmWidth - 2,
                    height: episodeVideoSmHeight - 2,
                  }}
                  source={{
                    uri: item.videoUri,
                  }}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                />
              ) : (
                <Image
                  style={styles.videoSmImageFallback}
                  source={defaultSendToFightPNG}
                />
              )}
            </TertiaryBox>
          )}
          style={{}}
        />
      </View>
    </GameContentView>
  );
};
