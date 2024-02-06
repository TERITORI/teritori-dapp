import React, { FC } from "react";
import { ScrollView, useWindowDimensions } from "react-native";

import { FeedMapList } from "./FeedMapList";
import { MobileTitle } from "../../../../components/ScreenContainer/ScreenContainerMobile";
import { useIsMobile } from "../../../../hooks/useIsMobile";
import { useMaxResolution } from "../../../../hooks/useMaxResolution";
import { headerHeight } from "../../../../utils/style/layout";
import { FeedHeader } from "../FeedHeader";

export const MapFeed: FC = () => {
  const { height: windowHeight } = useWindowDimensions();
  const { height } = useMaxResolution();
  const isMobile = useIsMobile();
  return (
    <ScrollView style={{ height }}>
      {isMobile && <MobileTitle title="SOCIAL FEED" />}
      <FeedHeader selectedTab="map" />
      <FeedMapList
        style={{
          alignSelf: "center",
          width: "100%",
          height: windowHeight - (headerHeight + 64),
        }}
      />
    </ScrollView>
  );
};
