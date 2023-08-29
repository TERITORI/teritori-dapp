import { useIsFocused } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

import { GameContentView } from "./component/GameContentView";
import defaultSendToFightPNG from "../../../assets/game/default-video-send-to-fight.png";
import { BrandText } from "../../components/BrandText";
import { EmbeddedWeb } from "../../components/EmbeddedWeb";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { SpacerColumn } from "../../components/spacer";
import { fontMedium32 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

const seasonVideoUri =
  "https://www.youtube.com/embed/videoseries?list=PLRcO8OPsbd7zhj7PDysX2XIh095tazSWM";
const seasonVideoHeight = 293;
const seasonVideoWidth = 516;
const episodeVideoSmHeight = 245;
const episodeVideoSmWidth = 430;

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

  return (
    <GameContentView>
      <View style={contentContainerStyle} onLayout={() => setDisplayYT(true)}>
        {/* Current season */}
        <BrandText style={[fontMedium32, titleStyle]}>
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
        <BrandText style={[fontMedium32, titleStyle]}>
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
              style={videoSmBoxStyle}
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
                  style={videoSmImageFallbackStyle}
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

const contentContainerStyle: ViewStyle = {
  padding: layout.padding_x4,
};
const videoSmBoxStyle: ViewStyle = {
  marginRight: layout.padding_x2_5,
  marginBottom: layout.padding_x2_5,
};
const videoSmImageFallbackStyle: ImageStyle = {
  height: "100%",
  width: "100%",
  borderRadius: 7,
};
const titleStyle: ViewStyle = {
  marginBottom: layout.padding_x2,
};
