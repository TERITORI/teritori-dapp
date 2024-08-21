import React, { FC, useState } from "react";
import { View } from "react-native";

import {
  Collection,
  MintState,
  Sort,
  SortDirection,
} from "@/api/marketplace/v1/marketplace";
import { Tabs } from "@/components/tabs/Tabs";
import { useBanners } from "@/hooks/marketing/useBanners";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { getNetwork } from "@/networks";
import { BannersEdition } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAdministrationOverview/component/MarketingEdition/BannersEdition";
import { CollectionsEdition } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAdministrationOverview/component/MarketingEdition/CollectionsEdition/CollectionsEdition";
import { NewsEdition } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAdministrationOverview/component/MarketingEdition/NewsEdition";
import { layout } from "@/utils/style/layout";

const marketingTabs = {
  banners: {
    name: "Home Banner",
    badgeCount: 42,
  },
  news: {
    name: "Highlighted News",
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
  const banners = useBanners(networkId);
  const banner = banners?.length ? banners[0] : undefined;
  const [selectedMarketingTab, setSelectedMarketingTab] =
    useState<keyof typeof marketingTabs>("banners");

  return (
    <View style={{ marginVertical: layout.spacing_x4 }}>
      <Tabs
        items={marketingTabs}
        selected={selectedMarketingTab}
        style={{ height: 48, marginBottom: layout.spacing_x4 }}
        onSelect={setSelectedMarketingTab}
      />
      {selectedMarketingTab === "banners" && !!banner && <BannersEdition />}
      {selectedMarketingTab === "news" && <NewsEdition />}
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
