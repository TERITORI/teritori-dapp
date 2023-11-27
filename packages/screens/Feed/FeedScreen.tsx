import React from "react";

import { ArticlesFeedScreen } from "./ArticlesFeedScreen";
import { ModerationFeedScreen } from "./ModerationFeedScreen";
import { MusicFeedScreen } from "./MusicFeedScreen";
import { PicsFeedScreen } from "./PicsFeedScreen";
import { VideosFeedScreen } from "./VideosFeedScreen";
import { FeedHeader } from "./components/FeedHeader";
import { PostsRequest } from "../../api/feed/v1/feed";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { MobileTitle } from "../../components/ScreenContainer/ScreenContainerMobile";
import { NewsFeed } from "../../components/socialFeed/NewsFeed/NewsFeed";
import { VideosList } from "../../components/video/VideosList";
import { useForceNetworkSelection } from "../../hooks/useForceNetworkSelection";
import { useIsMobile } from "../../hooks/useIsMobile";
import { NetworkFeature } from "../../networks";
import { ScreenFC } from "../../utils/navigation";

export const FeedScreen: ScreenFC<"Feed"> = ({ route: { params } }) => {
  useForceNetworkSelection(params?.network);
  const isMobile = useIsMobile();
  const defaultFeedRequest: Partial<PostsRequest> = {
    filter: {
      categories: [],
      user: "",
      mentions: [],
      hashtags: [],
    },
    limit: 10,
    offset: 0,
  };

  switch (params?.tab) {
    case "music":
      return <MusicFeedScreen />;
    case "pics":
      return <PicsFeedScreen />;
    case "videos":
      return <VideosFeedScreen />;
    case "articles":
      return <ArticlesFeedScreen />;
    case "moderationDAO":
      return <ModerationFeedScreen />;
    default:
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
            req={defaultFeedRequest}
            isFlagged={params?.tab === "moderationDAO"}
            disablePosting={params?.tab === "moderationDAO"}
            Header={() => (
              <>
                {/* ScreenContainer has noScroll, so we need to add MobileTitle here */}
                {isMobile && <MobileTitle title="SOCIAL FEED" />}
                <FeedHeader selectedTab="" />
              </>
            )}
          />
        </ScreenContainer>
      );
  }
};
