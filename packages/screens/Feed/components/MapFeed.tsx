import React, { Suspense, lazy } from "react";
import { Platform, ScrollView, useWindowDimensions } from "react-native";

import { FeedHeader } from "./FeedHeader";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import { headerHeight } from "../../../utils/style/layout";

import { MobileTitle } from "@/components/ScreenContainer/ScreenContainerMobile";
import {PostsRequest} from "@/api/feed/v1/feed";
import {PostCategory} from "@/utils/types/feed";
import {useFetchFeed} from "@/hooks/feed/useFetchFeed";

const MapView = Platform.select({
  native: () =>
    lazy(
      () =>
        import(
          "@/components/socialFeed/NewsFeed/FeedMapList/FeedMapList.native"
        ),
    ),
  web: () =>
    lazy(
      () =>
        import("@/components/socialFeed/NewsFeed/FeedMapList/FeedMapList.web"),
    ),
  default: () =>
    lazy(
      () =>
        import("@/components/socialFeed/NewsFeed/FeedMapList/FeedMapList.web"),
    ),
})();

export const MapFeed = () => {
  const { height: windowHeight } = useWindowDimensions();
  const { height } = useMaxResolution();
  const isMobile = useIsMobile();

  const mapFeedRequest: Partial<PostsRequest> = {
    filter: {
      categories: [],
      user: "",
      mentions: [],
      hashtags: [],
      premiumLevelMin: 0,
      premiumLevelMax: -1,
      hasLocation: true
    },
    limit: 10,
    offset: 0,
  };

  // ======= Getting MusicAudio posts as single tracks
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useFetchFeed(mapFeedRequest);

  return (
    <ScrollView style={{ height }}>
      {isMobile && <MobileTitle title="SOCIAL FEED" />}
      <FeedHeader selectedTab="map" />
      <Suspense fallback={<></>}>
        <MapView
          style={{
            alignSelf: "center",
            width: "100%",
            height: windowHeight - (headerHeight + 64),
          }}
        />
      </Suspense>
    </ScrollView>
  );
};
