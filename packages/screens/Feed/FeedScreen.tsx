import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo } from "react";

import { ArticlesFeed } from "./components/ArticlesFeed";
import { FeedHeader } from "./components/FeedHeader";
import { MapFeed } from "./components/MapFeed";
import { ModerationFeed } from "./components/ModerationFeed";
import { MusicFeed } from "./components/MusicFeed";
import { PicsFeed } from "./components/PicsFeed";
import { VideosFeed } from "./components/VideosFeed";

import { PostsRequest } from "@/api/feed/v1/feed";
import { ScreenContainer } from "@/components/ScreenContainer";
import { MobileTitle } from "@/components/ScreenContainer/ScreenContainerMobile";
import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";
import { NewsFeed } from "@/components/socialFeed/NewsFeed/NewsFeed";
import { useForceNetworkSelection } from "@/hooks/useForceNetworkSelection";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import { NetworkFeature } from "@/networks";
import { ScreenFC } from "@/utils/navigation";

export const FeedScreen: ScreenFC<"Feed"> = ({
  route: { params },
  navigation: { setParams },
}) => {
  useForceNetworkSelection(params?.network);
  const isMobile = useIsMobile();
  const selectedNetwork = useSelectedNetworkInfo();
  const isReadonlyFeed = useMemo(
    () => selectedNetwork?.features.includes(NetworkFeature.SocialFeedReadonly),
    [selectedNetwork?.features],
  );

  const updateParams = useCallback(() => {
    setParams({ network: selectedNetwork?.id });
  }, [setParams, selectedNetwork?.id]);

  useFocusEffect(updateParams);

  const defaultFeedRequest = useMemo(() => {
    if (selectedNetwork) {
      return getDefaultFeedRequest(selectedNetwork.id);
    }
  }, [selectedNetwork]);

  const feedContent = useMemo(() => {
    switch (params?.tab) {
      case "music":
        return <MusicFeed disablePosting={isReadonlyFeed} />;
      case "map":
        return (
          <MapFeed consultedPostId={params?.post ? params.post : undefined} />
        );
      case "pics":
        return <PicsFeed disablePosting={isReadonlyFeed} />;
      case "videos":
        return <VideosFeed disablePosting={isReadonlyFeed} />;
      case "articles":
        return <ArticlesFeed disablePosting={isReadonlyFeed} />;
      case "moderationDAO":
        return <ModerationFeed />;
      default:
        if (!defaultFeedRequest) return null;
        return (
          <NewsFeed
            req={defaultFeedRequest}
            isFlagged={params?.tab === "moderationDAO"}
            disablePosting={params?.tab === "moderationDAO" || isReadonlyFeed}
            Header={() => (
              <>
                {/* ScreenContainer in FeedScreen has noScroll, so we need to add MobileTitle here */}
                {isMobile && <MobileTitle title="SOCIAL FEED" />}
                <FeedHeader selectedTab="" />
              </>
            )}
          />
        );
    }
  }, [params?.tab, params?.post, isReadonlyFeed, defaultFeedRequest, isMobile]);

  return (
    <ScreenContainer
      fullWidth
      // noScroll is needed to let feeds FlatList handle the scroll and support infinite load
      noScroll
      responsive
      footerChildren={<></>}
      forceNetworkFeatures={[
        NetworkFeature.SocialFeed,
        NetworkFeature.SocialFeedReadonly,
      ]}
      headerChildren={<ScreenTitle>Social Feed</ScreenTitle>}
    >
      {feedContent}
    </ScreenContainer>
  );
};

const getDefaultFeedRequest: (networkId: string) => Partial<PostsRequest> = (
  networkId,
) => ({
  filter: {
    networkId,
    categories: [],
    user: "",
    mentions: [],
    hashtags: [],
    premiumLevelMin: 0,
    premiumLevelMax: -1,
  },
  limit: 10,
  offset: 0,
});
