import React from "react";
import { View, FlatList } from "react-native";

import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { Sort, SortDirection } from "../../api/marketplace/v1/marketplace";
import { useNFTs } from "../../hooks/useNFTs";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { SVG } from "../SVG";
import { NFTView } from "../nfts/NFTView";

import { fontRegular14, fontRegular20 } from "@/utils/style/fonts";

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
    <View style={{ paddingTop: 32 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <BrandText style={[fontRegular20, { marginRight: 20 }]}>
          My NFTs
        </BrandText>
        <OmniLink
          to={{ screen: "MyCollection" }}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <BrandText style={[fontRegular14, { marginRight: 16 }]}>
            See All
          </BrandText>
          <SVG source={chevronRightSVG} height={16} />
        </OmniLink>
      </View>
      <View style={{ flexDirection: "row" }}>
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
