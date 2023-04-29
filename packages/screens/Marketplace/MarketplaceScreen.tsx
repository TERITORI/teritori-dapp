import React from "react";
import { View } from "react-native";

import {
  MintState,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { ScreenContainer } from "../../components/ScreenContainer";
import { CollectionsCarouselHeader } from "../../components/carousels/CollectionsCarouselHeader";
import { CollectionGallery } from "../../components/collections/CollectionGallery";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getNetwork } from "../../networks";
import { ScreenFC } from "../../utils/navigation";
import { layout, MOBILE_MAX_WIDTH } from "../../utils/style/layout";

const supportedNetworks = [
  "teritori",
  "teritori-testnet",
  "ethereum",
  "ethereum-goerli",
];

export const MarketplaceScreen: ScreenFC<"Marketplace"> = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const { width } = useMaxResolution();

  return (
    <ScreenContainer forceNetworkIds={supportedNetworks} responsive>
      <View
        style={{
          paddingBottom: layout.contentPadding,
        }}
      >
        {MOBILE_MAX_WIDTH < width && (
          <CollectionsCarouselHeader
            req={{
              networkId: selectedNetworkId,
              sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
              upcoming: false,
              sort: Sort.SORTING_VOLUME,
              limit: 16,
              offset: 0,
              mintState: MintState.MINT_STATE_ENDED,
            }}
          />
        )}

        <CollectionGallery
          title={`${getNetwork(selectedNetworkId)?.displayName} Collections`}
          req={{
            networkId: selectedNetworkId,
            sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
            upcoming: false,
            sort: Sort.SORTING_VOLUME,
            limit: 32,
            offset: 0,
            mintState: MintState.MINT_STATE_UNSPECIFIED,
          }}
        />
        <CollectionGallery
          title="Upcoming Launches"
          req={{
            networkId: selectedNetworkId,
            upcoming: true,
            sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
            sort: Sort.SORTING_UNSPECIFIED,
            limit: 16,
            offset: 0,
            mintState: MintState.MINT_STATE_UNSPECIFIED,
          }}
        />
      </View>
    </ScreenContainer>
  );
};
