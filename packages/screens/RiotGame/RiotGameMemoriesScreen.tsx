import { useIsFocused } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
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
import { useIsMobile } from "../../hooks/useIsMobile";
import { fontMedium32 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

const seasonVideoUri =
  "https://www.youtube.com/embed/videoseries?list=PLRcO8OPsbd7zhj7PDysX2XIh095tazSWM";

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
  const isMobile = useIsMobile();
  const episodesVideosRefs = useRef<Video[]>([]);
  const [displayYT, setDisplayYT] = useState(false);
  const isScreenFocused = useIsFocused();

  const seasonVideoHeight = isMobile ? 214 : 293;
  const seasonVideoWidth = isMobile ? 400 : 516;
  const episodeVideoSmHeight = isMobile ? 240 : 245;
  const episodeVideoSmWidth = isMobile ? 425 : 430;

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
      <View
        style={{
          padding: isMobile ? layout.spacing_x1 : layout.spacing_x4,
        }}
        onLayout={() => setDisplayYT(true)}
      >
        {/* Current season */}
        <BrandText style={[fontMedium32, titleStyles]}>
          The R!ot Season I
        </BrandText>
        <TertiaryBox
          style={{ height: seasonVideoHeight, width: seasonVideoWidth }}
        >
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
        <BrandText style={[fontMedium32, titleStyles]}>
          Operation Philipp Rustov
        </BrandText>
        <FlatList
          data={episodes}
          numColumns={numCol}
          key={numCol}
          renderItem={({ item, index }) => (
            <TertiaryBox
              key={index}
              style={{
                height: episodeVideoSmHeight - 2,
                width: episodeVideoSmWidth,
                marginRight: layout.spacing_x2_5,
                marginBottom: layout.spacing_x2_5,
              }}
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
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: 7,
                  }}
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

const titleStyles: ViewStyle = {
  marginBottom: layout.spacing_x2,
};
