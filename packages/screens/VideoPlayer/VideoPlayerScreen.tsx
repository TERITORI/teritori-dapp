import React, { useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";

import { VideoPlayerHomeContent } from "./VideoPlayerHomeContent";
import { VideoPlayerMyLibraryContent } from "./VideoPlayerMyLibraryContent";
import { GetVideoListRequest } from "../../api/video/v1/video";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { VideoPlayerTab } from "../../components/videoPlayer/VideoPlayerTab";
import { useFetchVideosForLibrary } from "../../hooks/video/useFetchVideosForLibrary";
import { ScreenFC } from "../../utils/navigation";
import { neutralA3, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const VideoPlayerScreen: ScreenFC<"VideoPlayer"> = () => {
  const tabData: string[] = ["Home", "My Library"];
  const [tab, setTab] = useState<string>(tabData[0]);
  const { data } = useFetchVideosForLibrary();
  const videoRequest: GetVideoListRequest = {
    limit: 10,
    offset: 0,
  };

  const videoListForLibrary = useMemo(() => (data ? data : []), [data]);

  return (
    <ScreenContainer
      headerChildren={<BrandText>Video Player</BrandText>}
      fullWidth
    >
      <View style={styles.pageConatiner}>
        <VideoPlayerTab tab={tab} setTab={setTab} />
        {tab === tabData[0] && (
          <VideoPlayerHomeContent
            req={videoRequest}
            videoListForLibrary={videoListForLibrary}
          />
        )}
        {tab === tabData[1] && (
          <VideoPlayerMyLibraryContent
            videoListForLibrary={videoListForLibrary}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  pageConatiner: {
    width: "100%",
    paddingHorizontal: 80,
  },
  tabContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    gap: layout.padding_x3,
  },
  selectedUnitBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: layout.padding_x1_5,
    paddingVertical: layout.padding_x2_5,
    borderBottomColor: secondaryColor,
    borderBottomWidth: 2,
    paddingRight: 6,
  },
  unselectedUnitBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: layout.padding_x1_5,
    paddingVertical: layout.padding_x2_5,
    borderBottomColor: secondaryColor,
    borderBottomWidth: 0,
    paddingRight: 6,
  },
  selectedText: StyleSheet.flatten([fontSemibold14]),
  unselectedText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutralA3,
    },
  ]),
  divideLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 1,
    backgroundColor: neutralA3,
    width: "100%",
  },
});
