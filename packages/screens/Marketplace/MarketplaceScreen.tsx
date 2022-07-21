import React, { useEffect, useState } from "react";
import { useWindowDimensions, View } from "react-native";

import {
  Collection,
  CollectionsRequest,
} from "../../api/marketplace/v1/marketplace";
import { CarouselSection } from "../../components/CarouselSection";
import {
  collectionItemHeight,
  collectionItemWidth,
  CollectionView,
} from "../../components/CollectionView";
import { LaunchpadCarouselSection } from "../../components/LaunchpadCarouselSection";
import { ScreenContainer } from "../../components/ScreenContainer";
import { backendClient } from "../../utils/backend";
import { helpAreaWidth, sidebarWidth } from "../../utils/layout";

const useCollections = (req: CollectionsRequest) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  useEffect(() => {
    let cancelled = false;
    const effect = async () => {
      const stream = backendClient.Collections(req);
      const collections: Collection[] = [];
      await stream.forEach((response) => {
        collections.push(response.collection);
      });
      if (cancelled) {
        return;
      }
      setCollections(collections);
    };
    effect();
    return () => {
      cancelled = true;
    };
  }, []);
  return collections;
};

const CollectionsCarouselSection: React.FC<{
  title: string;
  width: number;
}> = ({ title, width }) => {
  const collections = useCollections({});
  return (
    <CarouselSection
      title={title}
      data={collections}
      width={collectionItemWidth + 24}
      height={collectionItemHeight}
      loop={false}
      style={{
        width,
      }}
      renderItem={CollectionView}
    />
  );
};

export const MarketplaceScreen: React.FC = () => {
  const { width: windowWidth } = useWindowDimensions();
  const horizontalPadding = 114;
  const carouselWidth =
    windowWidth - (sidebarWidth + helpAreaWidth + horizontalPadding * 2);
  return (
    <ScreenContainer>
      <View style={{ paddingHorizontal: horizontalPadding, paddingTop: 100 }}>
        <LaunchpadCarouselSection
          title="Upcoming Launches"
          width={carouselWidth}
        />
        <CollectionsCarouselSection
          title="Popular collections"
          width={carouselWidth}
        />
        <CollectionsCarouselSection title="Auctions" width={carouselWidth} />
        <CollectionsCarouselSection
          title="TERITORI Features Collections"
          width={carouselWidth}
        />
        <CollectionsCarouselSection
          title="Top Market Cap"
          width={carouselWidth}
        />
        <CollectionsCarouselSection
          title="Featured Art"
          width={carouselWidth}
        />
        <CollectionsCarouselSection
          title="Featured Games"
          width={carouselWidth}
        />
      </View>
    </ScreenContainer>
  );
};
