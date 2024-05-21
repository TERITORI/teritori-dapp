import React, { useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { PeriodFilter } from "./PeriodFilter";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SearchInput } from "@/components/sorts/SearchInput";
import { SpacerRow } from "@/components/spacer";
import { Tabs } from "@/components/tabs/Tabs";
import { usePopularCollections } from "@/hooks/marketplace/usePopularCollections";
import { useEnabledNetworks } from "@/hooks/useEnabledNetworks";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { NetworkFeature } from "@/networks";
import { CollectionsTable } from "@/screens/Marketplace/CollectionsTable";
import { selectTimePeriod } from "@/store/slices/marketplaceFilters";
import { ScreenFC } from "@/utils/navigation";
import { fontSemibold20, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { arrayIncludes } from "@/utils/typescript";

export const MarketplaceScreen: ScreenFC<"Marketplace"> = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const enabledNetworks = useEnabledNetworks();
  const timePeriod = useSelector(selectTimePeriod);
  const isMobile = useIsMobile();

  const marketplaceNetworks = enabledNetworks.filter((network) => {
    return network.features.includes(NetworkFeature.NFTMarketplace);
  });

  const tabs = marketplaceNetworks.reduce(
    (tabs, network) => ({
      ...tabs,
      [network.id]: { name: network.displayName },
    }),
    {} as Record<string, { name: string }>,
  );

  const tabsKeys = Object.keys(tabs);

  const [selectedTab, setSelectedTab] = useState(
    arrayIncludes(tabsKeys, selectedNetworkId)
      ? selectedNetworkId
      : tabsKeys[0],
  );

  const { data: collections } = usePopularCollections(
    selectedTab,
    timePeriod.value / 60,
  );

  const [filterText, setFilterText] = useState("");

  const handleChangeText = (e: string) => {
    setFilterText(e);
  };
  return (
    <ScreenContainer
      isLarge
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>NFT Marketplace</BrandText>
      }
      responsive
    >
      <View
        style={{
          marginTop: layout.spacing_x4,
        }}
      >
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BrandText style={fontSemibold28}>Popular Collections</BrandText>
          <Tabs
            items={tabs}
            selected={selectedTab}
            style={{ height: 48 }}
            onSelect={setSelectedTab}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            flex: 12,
            flexWrap: "nowrap",
            justifyContent: "space-between",
            marginTop: layout.spacing_x4,
            marginBottom: layout.spacing_x4,
            zIndex: 1,
          }}
        >
          <SearchInput
            style={{
              flex: 7,
            }}
            handleChangeText={handleChangeText}
          />
          <SpacerRow size={2} />
          <PeriodFilter />
        </View>

        <CollectionsTable
          collections={collections || []}
          filterText={filterText}
        />
      </View>
    </ScreenContainer>
  );
};
