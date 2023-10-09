import React, { useState, useMemo } from "react";
import { View } from "react-native";

import { VideoPlayerHomeContent } from "./VideoPlayerHomeContent";
import { VideoPlayerMyLibraryContent } from "./VideoPlayerMyLibraryContent";
import { GetVideoListRequest } from "../../api/video/v1/video";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { VideoPlayerTab } from "../../components/videoPlayer/VideoPlayerTab";
import { useFetchVideosForLibrary } from "../../hooks/video/useFetchVideosForLibrary";
import { ScreenFC } from "../../utils/navigation";

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
      <View
        style={{
          width: "100%",
          paddingHorizontal: 80,
        }}
      >
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
