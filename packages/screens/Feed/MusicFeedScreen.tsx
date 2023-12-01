import React, { FC } from "react";

import { FeedHeader } from "./components/FeedHeader";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { MobileTitle } from "../../components/ScreenContainer/ScreenContainerMobile";
import { MusicList } from "../../components/music/MusicList";
import { useIsMobile } from "../../hooks/useIsMobile";
import { NetworkFeature } from "../../networks";

export const MusicFeedScreen: FC = () => {
  const isMobile = useIsMobile();
  return (
    <ScreenContainer
      responsive
      footerChildren={<></>}
      forceNetworkFeatures={[NetworkFeature.SocialFeed]}
      headerChildren={<BrandText>Social Feed</BrandText>}
    >
      {/* ScreenContainer has noScroll, so we need to add MobileTitle here */}
      {isMobile && <MobileTitle title="SOCIAL FEED" />}
      <FeedHeader selectedTab="music" />
      <MusicList title="All music" allowUpload />
    </ScreenContainer>
  );
};
