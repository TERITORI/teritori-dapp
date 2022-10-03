import React from "react";
import { View } from "react-native";

import { CollectionsRequest_Kind } from "../../api/marketplace/v1/marketplace";
import { CollectionsCarouselSection } from "../../components/CollectionsCarouselSection";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ScreenFC } from "../../utils/navigation";

export const MarketplaceScreen: ScreenFC<"Marketplace"> = () => {
  return (
    <ScreenContainer>
      <View style={{ paddingTop: 100 }}>
        <CollectionsCarouselSection
          title="Upcoming Launches"
          kind={CollectionsRequest_Kind.KIND_UPCOMING}
        />
        <CollectionsCarouselSection
          title="Popular collections"
          kind={CollectionsRequest_Kind.KIND_BY_VOLUME}
        />
        <CollectionsCarouselSection title="Auctions" />
        <CollectionsCarouselSection
          title="TERITORI Features Collections"
          kind={CollectionsRequest_Kind.KIND_TERITORI_FEATURES}
        />
        <CollectionsCarouselSection
          title="Top Market Cap"
          kind={CollectionsRequest_Kind.KIND_BY_MARKETCAP}
        />
        <CollectionsCarouselSection title="Featured Art" />
        <CollectionsCarouselSection title="Featured Games" />
      </View>
    </ScreenContainer>
  );
};
