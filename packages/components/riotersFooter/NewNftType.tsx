import React from "react";
import { TouchableOpacity, View } from "react-native";

import addSvg from "../../../assets/icons/add.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import CollectionItem from "./CollectionItem";

const NewNftType: React.FC<{
  searchNewNftCollection: string;
  setSearchNewNftCollection: (text: string) => void;
  setNftCollectionId: (text: string) => void;
  newNftCollections: any[];
}> = ({
  searchNewNftCollection,
  setSearchNewNftCollection,
  setNftCollectionId,
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
          onPress={() => {
            setNftCollectionId(collection.id);
          }}
          key={collection.id}
        >
          <CollectionItem collection={collection} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default NewNftType;
