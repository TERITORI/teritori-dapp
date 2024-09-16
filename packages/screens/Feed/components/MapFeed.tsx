import React, { Suspense, lazy } from "react";
import { Platform, ScrollView, useWindowDimensions } from "react-native";

import { FeedHeader } from "./FeedHeader";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import {
  headerHeight,
  RESPONSIVE_BREAKPOINT_S,
  screenContentMaxWidth,
} from "../../../utils/style/layout";

import { MobileTitle } from "@/components/ScreenContainer/ScreenContainerMobile";

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
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { width, height } = useMaxResolution();
  const isMobile = useIsMobile();

  return (
    <ScrollView style={{ height }}>
      {isMobile && <MobileTitle title="SOCIAL FEED" />}
      <FeedHeader selectedTab="map" />
      <Suspense fallback={<></>}>
        <MapView
          style={{
            alignSelf: "center",
            height: windowHeight - (headerHeight + 110),
            width: windowWidth < RESPONSIVE_BREAKPOINT_S ? windowWidth : width,
            maxWidth: screenContentMaxWidth,
          }}
        />
      </Suspense>
    </ScrollView>
  );
};
