import React, { useCallback } from "react";

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
  linkToMint?: boolean;
  req?: CollectionsRequest;
  filter?: (c: Collection) => boolean;
}> = ({ title, req = defaultRequest, linkToMint, filter }) => {
  const [collections, fetchMore] = useCollections(req, filter);

  const { width } = useMaxResolution();

  const renderItem = useCallback(
    (props: { item: Collection }) => (
      <CollectionView item={props.item} linkToMint={linkToMint} />
    ),
    [linkToMint]
  );

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
