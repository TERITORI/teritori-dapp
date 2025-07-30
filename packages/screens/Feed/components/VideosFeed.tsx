import React, { FC, useMemo } from "react";
import { ScrollView, useWindowDimensions } from "react-native";

import { FeedHeader } from "./FeedHeader";

import { PostsRequest } from "@/api/feed/v1/feed";
import { MobileTitle } from "@/components/ScreenContainer/ScreenContainerMobile";
import { FeedVideosList } from "@/components/video/FeedVideosList";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { RESPONSIVE_BREAKPOINT_S } from "@/utils/style/layout";
import { PostCategory } from "@/utils/types/feed";

export const VideosFeed: FC = () => {
  const { width: windowWidth } = useWindowDimensions();
  const { width, height } = useMaxResolution({ isLarge: true });
  const isMobile = useIsMobile();
  const selectedNetworkId = useSelectedNetworkId();

  const feedRequest = useMemo(() => {
    const req: Partial<PostsRequest> = {
      filter: {
        networkId: selectedNetworkId,
        categories: [PostCategory.Video],
        user: "",
        mentions: [],
        hashtags: [],
        premiumLevelMin: 0,
        premiumLevelMax: -1,
      },
      limit: 10,
      offset: 0,
    };
    return req;
  }, [selectedNetworkId]);

  return (
    <ScrollView style={{ height }}>
      {/* ScreenContainer in FeedScreen has noScroll, so we need to add MobileTitle here */}
      {isMobile && <MobileTitle title="SOCIAL FEED" />}
      <FeedHeader selectedTab="videos" />
      <FeedVideosList
        allowUpload
        title="All videos"
        req={feedRequest}
        style={{
          alignSelf: "center",
          width: windowWidth < RESPONSIVE_BREAKPOINT_S ? windowWidth : width,
        }}
      />
    </ScrollView>
  );
};
