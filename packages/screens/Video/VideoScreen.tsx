import React, { useState } from "react";
import { View } from "react-native";

import { VideoHomeContent } from "./component/VideoHomeContent";
import { VideoMyLibraryContent } from "./component/VideoMyLibraryContent";
import { VideoTab } from "./component/VideoTab";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ScreenFC } from "../../utils/navigation";

export const VideoScreen: ScreenFC<"Video"> = () => {
  const tabData: string[] = ["Home", "My Library"];
  const [tab, setTab] = useState<string>(tabData[0]);

  return (
    <ScreenContainer
      headerChildren={<BrandText>Video</BrandText>}
      isLarge
      responsive
    >
      <View
        style={{
          width: "100%",
        }}
      >
        <VideoTab tab={tab} setTab={setTab} />
        {tab === tabData[0] && <VideoHomeContent />}
        {tab === tabData[1] && <VideoMyLibraryContent />}
      </View>
    </ScreenContainer>
  );
};
