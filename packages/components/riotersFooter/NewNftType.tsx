import React, { memo } from "react";
import { TouchableOpacity, View } from "react-native";

import addSvg from "../../../assets/icons/add.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TextInputCustomBorder } from "../inputs/TextInputCustomBorder";
import CollectionItem from "./CollectionItem";

const NewNftType: React.FC<{
  searchNewNftCollection: string;
  setSearchNewNftCollection: (text: string) => void;
  setNftCollectionId: (text: string) => void;
  newNftCollections: any[];
}> = memo(
  ({
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
        <TextInputCustomBorder
          style={{
            marginVertical: 12,
            minWidth: 20,
            width: 220,
            minHeight: 40,
            borderRadius: 8,
            backgroundColor: "black",
          }}
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
  }
);

export default NewNftType;
