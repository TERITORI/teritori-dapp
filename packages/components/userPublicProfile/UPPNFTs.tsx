import React, { useState } from "react";
import { View } from "react-native";

import { NFTsRequest } from "../../api/marketplace/v1/marketplace";
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
  userAddress: string;
  selectedTab: keyof typeof tabItemsNFTs;
}> = React.memo(({ userAddress, selectedTab }) => {
  const { width } = useMaxResolution();
  const numColumns = Math.floor(width / nftWidth);

  const nftsRequest: NFTsRequest = {
    collectionId: "",
    ownerId: `tori-${userAddress}`,
    limit: alignDown(20, numColumns) || numColumns,
    offset: 0,
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

export const UPPNFTs: React.FC<{ userAddress: string }> = ({ userAddress }) => {
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
        }}
      >
        <Tabs
          selected={selectedTab}
          items={tabItemsNFTs}
          onSelect={setSelectedTab}
          style={{ width: 436, height: 44, alignSelf: "flex-end" }}
        />
      </View>

      {userAddress && (
        <SelectedTabContent
          selectedTab={selectedTab}
          userAddress={userAddress}
          key={userAddress}
        />
      )}
    </>
  );
};
