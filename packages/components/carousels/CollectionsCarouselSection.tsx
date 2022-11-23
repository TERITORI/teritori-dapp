import React from "react";

import {
  Collection,
  CollectionsRequest,
  MintState,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { useCollections } from "../../hooks/useCollections";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import {
  collectionItemHeight,
  collectionItemWidth,
  CollectionView,
} from "../CollectionView";
import { CarouselSection } from "./CarouselSection";

const gap = 24;

const renderItem = (props: { item: Collection }) => (
  <CollectionView item={props.item} />
);

const defaultRequest: CollectionsRequest = {
  networkId: "fake",
  sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
  sort: Sort.SORTING_UNSPECIFIED,
  limit: 16,
  offset: 0,
  upcoming: false,
  mintState: MintState.MINT_STATE_UNSPECIFIED,
};

export const CollectionsCarouselSection: React.FC<{
  title: string;
  req?: CollectionsRequest;
}> = ({ title, req = defaultRequest }) => {
  const [collections, fetchMore] = useCollections(req);

  const { width } = useMaxResolution();

  return (
    <CarouselSection
      title={title}
      data={collections}
      width={collectionItemWidth + gap}
      height={collectionItemHeight}
      onScrollEnd={fetchMore}
      pagingEnabled
      loop={false}
      style={{
        width,
      }}
      renderItem={renderItem}
    />
  );
};
