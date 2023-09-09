import React, { useMemo, useState } from "react";

import { FeedHeader } from "./components/FeedHeader";
import { PostsRequest } from "../../api/feed/v1/feed";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { MobileTitle } from "../../components/ScreenContainer/ScreenContainerMobile";
import { NewsFeed } from "../../components/socialFeed/NewsFeed/NewsFeed";
import { useForceNetworkSelection } from "../../hooks/useForceNetworkSelection";
import { useIsMobile } from "../../hooks/useIsMobile";
import { NetworkFeature } from "../../networks";
import { ScreenFC } from "../../utils/navigation";
import { feedTabToCategories, feedsTabItems } from "../../utils/social-feed";

export const FeedScreen: ScreenFC<"Feed"> = ({ route: { params } }) => {
  useForceNetworkSelection(params?.network);
  const isMobile = useIsMobile();
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof feedsTabItems>("all");

  const feedRequest: PostsRequest = useMemo(() => {
    return {
      filter: {
        categories: feedTabToCategories(selectedTab),
        user: "",
        mentions: [],
        hashtags: [],
      },
      limit: 2,
      offset: 0,
    };
  }, [selectedTab]);

  return (
    <ScreenContainer
      fullWidth
      responsive
      noMargin
      noScroll
      footerChildren={<></>}
      forceNetworkFeatures={[NetworkFeature.SocialFeed]}
      headerChildren={<BrandText>Social Feed</BrandText>}
    >
      <NewsFeed
        req={feedRequest}
        isFlagged={selectedTab === "moderationDAO"}
        disablePosting={selectedTab === "moderationDAO"}
        Header={() => (
          <>
            {/* ScreenContainer has noScroll, so we need to add MobileTitle here */}
            {isMobile && <MobileTitle title="NEWS FEED" />}
            <FeedHeader
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
            />
          </>
        )}
      />
    </ScreenContainer>
  );
};
