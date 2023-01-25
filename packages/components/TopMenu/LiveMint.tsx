import React from "react";
import {TopMenuSection} from "./TopMenuSection";
import {layout, topMenuWidth} from "../../utils/style/layout";
import {SmallCarousel} from "../carousels/SmallCarousel";
import {CollectionView, collectionViewSMHeight, collectionViewSMWidth} from "../CollectionView";
import {useCollections} from "../../hooks/useCollections";
import {MintState, Sort, SortDirection} from "../../api/marketplace/v1/marketplace";
import {useSelectedNetworkId} from "../../hooks/useSelectedNetwork";
import {launchpadCollectionsFilter} from "../../utils/collections";

export const LiveMint: React.FC = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const [collections, fetchMore] = useCollections({
    networkId: selectedNetworkId,
    sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
    upcoming: false,
    sort: Sort.SORTING_VOLUME,
    limit: 16,
    offset: 0,
    mintState: MintState.MINT_STATE_RUNNING,
  }, launchpadCollectionsFilter);

  return (
    <TopMenuSection title="Live Mint" isCarousel>
      <SmallCarousel
        style={{width: topMenuWidth - 2, paddingLeft: layout.padding_x1}}
        width={collectionViewSMWidth + layout.padding_x1_5}
        data={collections} height={collectionViewSMHeight}
        loop={false}
        renderItem={({ item }) => (
          <CollectionView item={item} linkToMint={true} size="XS"/>
        )}
      />

    </TopMenuSection>
  )
}
