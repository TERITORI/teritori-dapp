import React, { Suspense, lazy } from "react";
import { Platform, ScrollView, useWindowDimensions } from "react-native";

import { FeedHeader } from "./FeedHeader";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import { headerHeight } from "../../../utils/style/layout";

import { MobileTitle } from "@/components/ScreenContainer/ScreenContainerMobile";

const MapView = Platform.select({
  native: () =>
    lazy(
      () =>
        import(
          "../../../components/socialFeed/NewsFeed/MapComponent/FeedMapList.native"
        ),
    ),
  default: () =>
    lazy(
      () =>
        import(
          "../../../components/socialFeed/NewsFeed/MapComponent/FeedMapList.web"
        ),
    ),
})();

export const MapFeed = () => {
  const { height: windowHeight } = useWindowDimensions();
  const { height } = useMaxResolution();
  const isMobile = useIsMobile();
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
