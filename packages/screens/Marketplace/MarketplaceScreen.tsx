import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import {
  MintState,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { ScreenContainer } from "../../components/ScreenContainer";
import { CollectionsCarouselHeader } from "../../components/carousels/CollectionsCarouselHeader";
import { CollectionsCarouselSection } from "../../components/carousels/CollectionsCarouselSection";
import { getNetwork } from "../../networks";
import { selectSelectedNetworkId } from "../../store/slices/settings";
import { ScreenFC } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";

export const MarketplaceScreen: ScreenFC<"Marketplace"> = () => {
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  return (
    <ScreenContainer>
      <View
        style={{
          paddingBottom: layout.contentPadding,
        }}
      >
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

        <CollectionsCarouselSection
          title={`${getNetwork(selectedNetworkId)?.displayName} Collections`}
          req={{
            networkId: selectedNetworkId,
            sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
            upcoming: false,
            sort: Sort.SORTING_VOLUME,
            limit: 16,
            offset: 0,
            mintState: MintState.MINT_STATE_UNSPECIFIED,
          }}
        />

        <CollectionsCarouselSection
          title="Upcoming Launches"
          req={{
            upcoming: true,
            networkId: "",
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
