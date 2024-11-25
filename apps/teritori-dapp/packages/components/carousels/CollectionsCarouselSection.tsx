import React, { useCallback } from "react";

import { CarouselSection } from "./CarouselSection";
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
  COLLECTION_VIEW_XL_HEIGHT,
  COLLECTION_VIEW_XL_WIDTH,
  CollectionView,
} from "../CollectionView";

const gap = 20;

const defaultRequest: CollectionsRequest = {
  networkId: "fake",
  sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
  sort: Sort.SORT_UNSPECIFIED,
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
  const { collections, fetchMore } = useCollections(req, filter);

  const { width } = useMaxResolution();

  const renderItem = useCallback(
    (props: { item: Collection }) => (
      <CollectionView
        item={props.item}
        linkToMint={linkToMint}
        mintState={req.mintState}
      />
    ),
    [linkToMint, req.mintState],
  );

  return (
    <CarouselSection
      title={title}
      data={collections}
      width={COLLECTION_VIEW_XL_WIDTH + gap}
      height={COLLECTION_VIEW_XL_HEIGHT}
      onScrollEnd={fetchMore}
      pagingEnabled={collections.length > 4}
      loop={false}
      style={{
        width,
      }}
      renderItem={renderItem}
    />
  );
};
