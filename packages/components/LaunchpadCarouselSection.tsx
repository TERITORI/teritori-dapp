import React from "react";

import { CarouselSection } from "./CarouselSection";
import {
  collectionItemHeight,
  collectionItemWidth,
  CollectionView,
} from "./CollectionView";
import { useLaunchpadData } from "./LaunchpadProvider";

export const LaunchpadCarouselSection: React.FC<{
  title: string;
  width: number;
}> = ({ title, width }) => {
  const { launchpadItems: unfilteredLaunchpadItems } = useLaunchpadData();
  const launchpadItems = unfilteredLaunchpadItems.filter(
    (item) => /*item.shouldDisplay &&*/ !!item.imageUri
  );
  return (
    <CarouselSection
      title={title}
      data={launchpadItems}
      renderItem={CollectionView}
      width={collectionItemWidth + 24}
      height={collectionItemHeight}
      loop={false}
      style={{
        width,
      }}
    />
  );
};
