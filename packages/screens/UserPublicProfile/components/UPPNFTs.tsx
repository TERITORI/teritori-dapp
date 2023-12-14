import React, { useState } from "react";
import { View } from "react-native";

import {
  NFTsRequest,
  Sort,
  SortDirection,
} from "../../../api/marketplace/v1/marketplace";
import { NFTs } from "../../../components/nfts/NFTs";
import { Tabs } from "../../../components/tabs/Tabs";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import { alignDown } from "../../../utils/align";

const tabItemsNFTs = {
  collected: { name: "Collected" },
  created: { name: "Created", disabled: true },
  favorited: { name: "Favorited", disabled: true },
};

const nftWidth = 268;

const SelectedTabContent: React.FC<{
  userId: string;
  selectedTab: keyof typeof tabItemsNFTs;
}> = React.memo(({ userId, selectedTab }) => {
  const { width } = useMaxResolution();
  const numColumns = Math.floor(width / nftWidth);

  const nftsRequest: NFTsRequest = {
    collectionId: "",
    ownerId: userId,
    limit: alignDown(20, numColumns) || numColumns,
    offset: 0,
    sort: Sort.SORT_PRICE,
    sortDirection: SortDirection.SORT_DIRECTION_ASCENDING,
    attributes: [],
    isListed: false,
    priceRange: undefined,
  };

  switch (selectedTab) {
    case "collected":
      return <NFTs req={nftsRequest} hideFilters />;
    case "created":
      return <></>;
    case "favorited":
      return <></>;
    default:
      return null;
  }
});

export const UPPNFTs: React.FC<{ userId: string }> = ({ userId }) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof tabItemsNFTs>("collected");

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Tabs
          selected={selectedTab}
          items={tabItemsNFTs}
          onSelect={setSelectedTab}
          style={{ alignSelf: "flex-end", height: 45, marginTop: -10 }}
        />
      </View>

      {userId && (
        <SelectedTabContent
          selectedTab={selectedTab}
          userId={userId}
          key={userId}
        />
      )}
    </>
  );
};
