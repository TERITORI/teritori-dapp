import React from "react";
import { TouchableOpacity, View } from "react-native";

import addSvg from "../../../assets/icons/add.svg";
import badgeSvg from "../../../assets/icons/badge.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";

const NewNftType: React.FC<{
  searchNewNftCollection: string;
  setSearchNewNftCollection: (text: string) => void;
  setNftId: (text: string) => void;
  newNftCollections: any[];
}> = ({
  searchNewNftCollection,
  setSearchNewNftCollection,
  setNftId,
  newNftCollections,
}) => {
  return (
    <View>
      <BrandText style={{ fontSize: 14, marginTop: 20 }}>
        Choose Collection
      </BrandText>
      <TextInputCustom
        style={{ marginVertical: 12, minWidth: 220, minHeight: 40 }}
        label=""
        placeHolder="Search collection or NFT"
        value={searchNewNftCollection}
        onChangeText={setSearchNewNftCollection}
      />
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => {
          console.log("add mint new nft");
        }}
      >
        <SVG
          width={32}
          height={32}
          source={addSvg}
          style={{ marginRight: 12 }}
        />
        <BrandText style={{ fontSize: 14 }}>Mint new NFT</BrandText>
      </TouchableOpacity>
      {newNftCollections.map((collection) => (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 12,
          }}
          onPress={() => {
            setNftId(collection.id);
          }}
          key={collection.id}
        >
          <SVG
            width={32}
            height={32}
            source={collection.avatar}
            style={{ marginRight: 12 }}
          />
          <BrandText style={{ fontSize: 14, marginRight: 8 }}>
            {collection.name}
          </BrandText>
          {collection.badge && <SVG width={16} height={16} source={badgeSvg} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default NewNftType;
