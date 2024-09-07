import React, { Suspense } from "react";
import { ScrollView, useWindowDimensions } from "react-native";

import { FeedHeader } from "./FeedHeader";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import {
  headerHeight,
  RESPONSIVE_BREAKPOINT_S,
  screenContentMaxWidth,
} from "../../../utils/style/layout";

import { MobileTitle } from "@/components/ScreenContainer/ScreenContainerMobile";
import { Map } from "@/components/socialFeed/Map";

export const MapFeed = () => {
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
        />
      </Suspense>
    </ScrollView>
  );
};
