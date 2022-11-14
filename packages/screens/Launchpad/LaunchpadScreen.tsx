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
        {/*TODO: LIVE MINTABLE*/}
        <CollectionsCarouselHeader kind={CollectionsRequest_Kind.KIND_FAKE} />

        {/*TODO: LIVE MINTABLE*/}
        <CollectionsCarouselSection
          title="Live"
          kind={CollectionsRequest_Kind.KIND_FAKE}
        />
        <CollectionsCarouselSection
          title="Upcoming"
          kind={CollectionsRequest_Kind.KIND_UPCOMING}
        />
        {/*TODO: ON MARKETPLACE (MINT ENDED)*/}
        <CollectionsCarouselSection
          title="Ended"
          kind={CollectionsRequest_Kind.KIND_FAKE}
        />
      </View>
    </ScreenContainer>
  );
};
