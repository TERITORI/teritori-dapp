import React from "react";
import { View } from "react-native";

import { CollectionsRequest_Kind } from "../../api/marketplace/v1/marketplace";
import { CollectionsCarouselSection } from "../../components/CollectionsCarouselSection";
import { ScreenContainer } from "../../components/ScreenContainer";

export const MarketplaceScreen: React.FC = () => {
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
        <CollectionsCarouselSection title="TERITORI Features Collections" />
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
