import { useIsFocused } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import React, { useEffect, useRef } from "react";
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
import { useGame } from "../../context/GameProvider";
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

  const { muteAudio, setEnteredInGame, currentAudio } = useGame();
  const episodesVideosRefs = useRef<Video[]>([]);
  const isFocused = useIsFocused();

  // The game audio changes on inStaking update. So, we need to force mute game audio when it happens
  useEffect(() => {
    if (isFocused) {
      muteAudio(true);
    }
  }, [currentAudio]);

  useEffect(() => {
    // Force enteredInGame, we don't need it because the game audio will be muted
    setEnteredInGame(true);
    // Mute current audio on this screen because pause/resume not works correctly with YouTube video (embeddedVideoUri in EmbeddedWeb)
    // Avoiding some audio glitches
    if (isFocused) {
      muteAudio(true);
    } else {
      // When leaving this screen from this screen, unmute the game audio
      // (Good to know : isFocused will never be false when the navigation doesn't start from this screen)
      muteAudio(false);
      // Stop all playing episodes videos
      episodesVideosRefs.current.forEach(async (video) => {
        if (!video) return;
        const status = await video.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await video.stopAsync();
        }
      });
    }
  }, [isFocused]);

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
              height={embeddedVideoSmHeight}
              width={embeddedVideoSmWidth}
              style={styles.videoSmBox}
            >
              {item.videoUri ? (
                <Video
                  ref={(item: Video) => episodesVideosRefs.current.push(item)}
                  style={{
                    borderRadius: 7,
                    width: embeddedVideoSmWidth - 2,
                    height: embeddedVideoSmHeight - 2,
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
