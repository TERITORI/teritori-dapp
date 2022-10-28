import React from "react";
import { View, TouchableOpacity, FlatList } from "react-native";

import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { NFTView } from "../../components/nfts/NFTView";
import { useNFTs } from "../../hooks/useNFTs";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useAppNavigation } from "../../utils/navigation";
import { neutral33 } from "../../utils/style/colors";

export const MyNFTs: React.FC = () => {
  const selectedWallet = useSelectedWallet();
  const navigation = useAppNavigation();
  const ownerId = `tori-${selectedWallet?.address}`; // FIXME: make this network-independent
  const { nfts, fetchMore } = useNFTs({
    offset: 0,
    limit: 20,
    ownerId,
    collectionId: "",
  });
  return (
    <View
      style={{
        paddingTop: 32,
        borderTopWidth: 1,
        borderColor: neutral33,
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
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate("MyCollection")}
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
        </TouchableOpacity>
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
          onEndReached={fetchMore}
          ItemSeparatorComponent={() => <View style={{ width: 34 }} />}
          renderItem={({ item }) => <NFTView data={item} />}
        />
      </View>
    </View>
  );
};
