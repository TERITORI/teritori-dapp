import React from "react";
import { View } from "react-native";

import { TopMenuSection } from "./TopMenuSection";
import {
  Collection,
  MintState,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { useCollections } from "../../hooks/useCollections";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getNetwork } from "../../networks";
import { layout, topMenuWidth } from "../../utils/style/layout";
import {
  CollectionView,
  COLLECTION_VIEW_SM_HEIGHT,
  COLLECTION_VIEW_SM_WIDTH,
} from "../CollectionView";
import { SmallCarousel } from "../carousels/SmallCarousel";

export const TopMenuLiveMint: React.FC = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const { collections } = useCollections(
    {
      networkId: selectedNetworkId,
      sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
      upcoming: false,
      sort: Sort.SORT_VOLUME,
      limit: 16,
      offset: 0,
      mintState: MintState.MINT_STATE_RUNNING,
    },
    launchpadCollectionsFilter,
  );
  return (
    <TopMenuSection title="Live Mint" isCarousel>
      <SmallCarousel
        style={{ width: topMenuWidth - 2 }}
        width={COLLECTION_VIEW_SM_WIDTH + layout.spacing_x1_5}
        data={collections}
        height={COLLECTION_VIEW_SM_HEIGHT}
        loop={false}
        renderItem={({ item }) => (
          <View style={{ alignItems: "flex-end" }}>
            <CollectionView
              item={item}
              linkToMint
              size="XS"
              mintState={item.mintState}
            />
          </View>
        )}
      />
    </TopMenuSection>
  );
};

const launchpadCollectionsFilter = (c: Collection) => {
  return !(getNetwork(c.networkId)?.excludeFromLaunchpadList || []).includes(
    c.mintAddress,
  );
};
