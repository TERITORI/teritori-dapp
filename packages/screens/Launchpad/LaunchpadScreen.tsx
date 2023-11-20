import React from "react";
import { View } from "react-native";

import {
  Collection,
  MintState,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { ScreenContainer } from "../../components/ScreenContainer";
import { CollectionsCarouselHeader } from "../../components/carousels/CollectionsCarouselHeader";
import { CollectionGallery } from "../../components/collections/CollectionGallery";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getNetwork, NetworkFeature } from "../../networks";
import { ScreenFC } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";

export const LaunchpadScreen: ScreenFC<"Launchpad"> = () => {
  const selectedNetworkId = useSelectedNetworkId();

  return (
    <ScreenContainer forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}>
      <View
        style={{
          paddingBottom: layout.contentSpacing,
        }}
      >
        <CollectionsCarouselHeader
          linkToMint
          req={{
            networkId: selectedNetworkId,
            sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
            upcoming: false,
            sort: Sort.SORT_VOLUME,
            limit: 16,
            offset: 0,
            mintState: MintState.MINT_STATE_RUNNING,
          }}
          filter={filter}
        />

        <CollectionGallery
          title="Live Mintable"
          linkToMint
          filter={filter}
          req={{
            networkId: selectedNetworkId,
            upcoming: false,
            sort: Sort.SORT_CREATED_AT,
            sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
            limit: 16,
            offset: 0,
            mintState: MintState.MINT_STATE_RUNNING,
          }}
        />

        <CollectionGallery
          title="Upcoming"
          linkToMint
          filter={filter}
          req={{
            networkId: selectedNetworkId,
            upcoming: true,
            sort: Sort.SORT_CREATED_AT,
            sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
            limit: 24,
            offset: 0,
            mintState: MintState.MINT_STATE_UNSPECIFIED,
          }}
        />

        <CollectionGallery
          title="Ended"
          req={{
            upcoming: false,
            networkId: selectedNetworkId,
            sort: Sort.SORT_CREATED_AT,
            sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
            limit: 16,
            offset: 0,
            mintState: MintState.MINT_STATE_ENDED,
          }}
        />
      </View>
    </ScreenContainer>
  );
};

const filter = (c: Collection) => {
  return !(getNetwork(c.networkId)?.excludeFromLaunchpadList || []).includes(
    c.mintAddress,
  );
};
