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
import { CollectionsCarouselSection } from "../../components/carousels/CollectionsCarouselSection";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getNetwork } from "../../networks";
import { ScreenFC } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";

export const LaunchpadScreen: ScreenFC<"Launchpad"> = () => {
  const selectedNetworkId = useSelectedNetworkId();

  return (
    <ScreenContainer>
      <View
        style={{
          paddingBottom: layout.contentPadding,
        }}
      >
        <CollectionsCarouselHeader
          linkToMint
          req={{
            networkId: selectedNetworkId,
            sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
            upcoming: false,
            sort: Sort.SORTING_VOLUME,
            limit: 16,
            offset: 0,
            mintState: MintState.MINT_STATE_RUNNING,
          }}
          filter={filter}
        />

        <CollectionsCarouselSection
          title="Live Mintable"
          linkToMint
          filter={filter}
          req={{
            networkId: selectedNetworkId,
            sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
            upcoming: false,
            sort: Sort.SORTING_VOLUME,
            limit: 16,
            offset: 0,
            mintState: MintState.MINT_STATE_RUNNING,
          }}
        />

        <CollectionsCarouselSection
          title="Upcoming"
          linkToMint
          filter={filter}
          req={{
            networkId: selectedNetworkId,
            sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
            upcoming: true,
            sort: Sort.SORTING_VOLUME,
            limit: 16,
            offset: 0,
            mintState: MintState.MINT_STATE_UNSPECIFIED,
          }}
        />

        <CollectionsCarouselSection
          title="Ended"
          req={{
            upcoming: false,
            networkId: selectedNetworkId,
            sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
            sort: Sort.SORTING_UNSPECIFIED,
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
    c.mintAddress
  );
};
