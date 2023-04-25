import React, { useState } from "react";
import { View } from "react-native";

import {
  NFTsRequest,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { alignDown } from "../../utils/align";
import { layout } from "../../utils/style/layout";
import { NFTs } from "../nfts/NFTs";
import { Tabs } from "../tabs/Tabs";

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
    sort: Sort.SORTING_PRICE,
    sortDirection: SortDirection.SORT_DIRECTION_ASCENDING,
  };

  switch (selectedTab) {
    case "collected":
      return (
        <NFTs
          req={nftsRequest}
          numColumns={numColumns}
          ListHeaderComponent={<View style={{ height: 20 }} />}
        />
      );
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
          height: 64,
          marginTop: layout.padding_x2_5 / 2,
          marginBottom: 16,
        }}
      >
        <Tabs
          selected={selectedTab}
          items={tabItemsNFTs}
          onSelect={setSelectedTab}
          style={{ width: 436, alignSelf: "flex-end", height: 45 }}
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
