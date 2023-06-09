import React from "react";
import { View, FlatList } from "react-native";

import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { Sort, SortDirection } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { OmniLink } from "../../components/OmniLink";
import { SVG } from "../../components/SVG";
import { NFTView } from "../../components/nfts/NFTView";
import { useNFTs } from "../../hooks/useNFTs";
import useSelectedWallet from "../../hooks/useSelectedWallet";

export const MyNFTs: React.FC = () => {
  const selectedWallet = useSelectedWallet();

  const { nfts, fetchMore } = useNFTs({
    offset: 0,
    limit: 4,
    ownerId: selectedWallet?.userId || "",
    collectionId: "",
    sortDirection: SortDirection.SORT_DIRECTION_ASCENDING,
    sort: Sort.SORT_PRICE,
    attributes: [],
    isListed: false,
    priceRange: undefined,
  });
  return (
    <View
      style={{
        paddingTop: 32,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <BrandText style={{ marginRight: 20, fontSize: 20 }}>My NFTs</BrandText>
        <OmniLink
          to={{
            screen: "MyCollection",
          }}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <BrandText
            style={{
              fontSize: 14,
              marginRight: 16,
            }}
          >
            See All
          </BrandText>
          <SVG source={chevronRightSVG} height={16} />
        </OmniLink>
      </View>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <FlatList
          data={nfts}
          horizontal
          keyExtractor={(nft) => nft.id}
          onEndReached={() => fetchMore()}
          ItemSeparatorComponent={() => <View style={{ width: 34 }} />}
          renderItem={({ item }) => <NFTView data={item} />}
        />
      </View>
    </View>
  );
};
