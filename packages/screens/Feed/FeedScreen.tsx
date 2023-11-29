import React, { useMemo, useState } from "react";

import { FeedHeader } from "./components/FeedHeader";
import { PostsRequest } from "../../api/feed/v1/feed";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { MobileTitle } from "../../components/ScreenContainer/ScreenContainerMobile";
import { MusicList } from "../../components/music/MusicList";
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

  const feedRequest: Partial<PostsRequest> = useMemo(() => {
    return {
      filter: {
        categories: feedTabToCategories(selectedTab),
        user: "",
        mentions: [],
        hashtags: [],
      },
      limit: 10,
      offset: 0,
    };
  }, [selectedTab]);

  const header = (
    <>
      {/* ScreenContainer has noScroll, so we need to add MobileTitle here */}
      {isMobile && <MobileTitle title="NEWS FEED" />}
      <FeedHeader selectedTab={selectedTab} onTabChange={setSelectedTab} />
    </>
  );

  let content = null;
  let autoMargins = true;
  let allowScroll = true;
  switch (selectedTab) {
    case "music":
      content = (
        <>
          {header}
          <MusicList title="All music" allowUpload />
        </>
      );
      break;
    case "videos":
      autoMargins = false;
      allowScroll = false;
      content = (
        <NewsFeed
          isVideos
          req={feedRequest}
          disablePosting
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
      );
      break;
    default:
      autoMargins = false;
      allowScroll = false;
      content = (
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
      );
  }

  return (
    <ScreenContainer
      fullWidth={!autoMargins}
      responsive
      noMargin={!autoMargins}
      noScroll={!allowScroll}
      footerChildren={<></>}
      forceNetworkFeatures={[NetworkFeature.SocialFeed]}
      headerChildren={<BrandText>Social Feed</BrandText>}
    >
      {content}
    </ScreenContainer>
  );
};
