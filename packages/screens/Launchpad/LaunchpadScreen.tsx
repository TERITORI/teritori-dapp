import React from "react";
import { View } from "react-native";

import { CollectionsRequest_Kind } from "../../api/marketplace/v1/marketplace";
import { ScreenContainer } from "../../components/ScreenContainer";
import { CollectionsCarouselHeader } from "../../components/carousels/CollectionsCarouselHeader";
import { CollectionsCarouselSection } from "../../components/carousels/CollectionsCarouselSection";
import { ScreenFC } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";

export const LaunchpadScreen: ScreenFC<"Launchpad"> = () => {
  return (
    <ScreenContainer>
      <View
        style={{
          paddingBottom: layout.contentPadding,
        }}
      >
        {/*TODO: MINTABLE*/}
        <CollectionsCarouselHeader kind={CollectionsRequest_Kind.KIND_FAKE} />

        {/*TODO: LIVE*/}
        <CollectionsCarouselSection
          title="Live Launches (?)"
          kind={CollectionsRequest_Kind.KIND_FAKE}
        />
        <CollectionsCarouselSection
          title="Upcoming Launches"
          kind={CollectionsRequest_Kind.KIND_UPCOMING}
        />
        {/*TODO: ENDED*/}
        <CollectionsCarouselSection
          title="Ended Launches"
          kind={CollectionsRequest_Kind.KIND_FAKE}
        />
      </View>
    </ScreenContainer>
  );
};
