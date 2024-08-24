import React, { FC, useState } from "react";
import { View } from "react-native";

import {
  Collection,
  MintState,
  Sort,
  SortDirection,
} from "@/api/marketplace/v1/marketplace";
import { Tabs } from "@/components/tabs/Tabs";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { getNetwork } from "@/networks";
import { CollectionsEdition } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAdministrationOverview/component/MarketingEdition/CollectionsEdition/CollectionsEdition";
import { layout } from "@/utils/style/layout";

// TODO: Responsive

const marketingTabs = {
  highlightedCollections: {
    name: "Highlighted",
    badgeCount: 3,
  },
  upcomingCollections: {
    name: "Upcoming Projects",
    badgeCount: 12,
  },
  liveCollections: {
    name: "Live Sale in Progress",
    badgeCount: 52,
  },
};

export const MarketingEdition: FC = () => {
  const networkId = useSelectedNetworkId();
  const [selectedMarketingTab, setSelectedMarketingTab] = useState<
    keyof typeof marketingTabs
  >("highlightedCollections");

  return (
    <View style={{ marginVertical: layout.spacing_x4 }}>
      <Tabs
        items={marketingTabs}
        selected={selectedMarketingTab}
        style={{ height: 48, marginBottom: layout.spacing_x4 }}
        onSelect={setSelectedMarketingTab}
      />
      {selectedMarketingTab === "highlightedCollections" && (
        <CollectionsEdition
          filter={filter}
          req={{
            networkId,
            sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
            upcoming: false,
            sort: Sort.SORT_VOLUME,
            limit: 16,
            offset: 0,
            mintState: MintState.MINT_STATE_RUNNING,
          }}
        />
      )}
      {selectedMarketingTab === "upcomingCollections" && (
        <CollectionsEdition
          filter={filter}
          req={{
            upcoming: true,
            networkId,
            sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
            sort: Sort.SORT_UNSPECIFIED,
            limit: 16,
            offset: 0,
            mintState: MintState.MINT_STATE_UNSPECIFIED,
          }}
        />
      )}
      {selectedMarketingTab === "liveCollections" && (
        <CollectionsEdition
          filter={filter}
          req={{
            networkId,
            upcoming: false,
            sort: Sort.SORT_CREATED_AT,
            sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
            limit: 16,
            offset: 0,
            mintState: MintState.MINT_STATE_RUNNING,
          }}
        />
      )}
    </View>
  );
};

const filter = (c: Collection) => {
  return !(getNetwork(c.networkId)?.excludeFromLaunchpadList || []).includes(
    c.mintAddress,
  );
};
