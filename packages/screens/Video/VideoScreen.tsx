import React, { useState } from "react";
import { View } from "react-native";

import { VideoHomeContent } from "./component/VideoHomeContent";
import { VideoMyLibraryContent } from "./component/VideoMyLibraryContent";
import { GetVideoListRequest } from "../../api/video/v1/video";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { VideoTab } from "../../components/videoPlayer/VideoTab";
import { ScreenFC } from "../../utils/navigation";

export const VideoScreen: ScreenFC<"Video"> = () => {
  const tabData: string[] = ["Home", "My Library"];
  const [tab, setTab] = useState<string>(tabData[0]);
  const videoRequest: GetVideoListRequest = {
    limit: 10,
    offset: 0,
  };

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
        <VideoTab tab={tab} setTab={setTab} />
        {tab === tabData[0] && <VideoHomeContent req={videoRequest} />}
        {tab === tabData[1] && <VideoMyLibraryContent />}
      </View>
    </ScreenContainer>
  );
};
