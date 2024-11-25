import React, { FC, Suspense } from "react";
import { ScrollView, useWindowDimensions } from "react-native";

import { FeedHeader } from "./FeedHeader";

import { MobileTitle } from "@/components/ScreenContainer/ScreenContainerMobile";
import { Map } from "@/components/socialFeed/Map";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import {
  headerHeight,
  RESPONSIVE_BREAKPOINT_S,
  screenContentMaxWidth,
} from "@/utils/style/layout";

export const MapFeed: FC<{
  consultedPostId?: string;
}> = ({ consultedPostId }) => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { width, height } = useMaxResolution();
  const isMobile = useIsMobile();

  return (
    <ScrollView style={{ height }}>
      {isMobile && <MobileTitle title="SOCIAL FEED" />}
      <FeedHeader selectedTab="map" />
      <Suspense fallback={<></>}>
        <Map
          style={{
            height: windowHeight - (headerHeight + 110),
            width: windowWidth < RESPONSIVE_BREAKPOINT_S ? windowWidth : width,
            maxWidth: screenContentMaxWidth,
          }}
          consultedPostId={consultedPostId}
        />
      </Suspense>
    </ScrollView>
  );
};
