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
        {/*TODO: Need collections fetching filters*/}
        {/*TODO: (Better) : Need to fetch collections from ??? to allows marketing team to choose which collections to display here and on MarketplaceScreen*/}

        <CollectionsCarouselHeader
          kind={CollectionsRequest_Kind.KIND_TERITORI_FEATURES}
        />

        <CollectionsCarouselSection
          title="TERITORI Collections"
          kind={CollectionsRequest_Kind.KIND_TERITORI_FEATURES}
        />
        <CollectionsCarouselSection
          title="Upcoming Launches"
          kind={CollectionsRequest_Kind.KIND_UPCOMING}
        />
      </View>
    </ScreenContainer>
  );
};
