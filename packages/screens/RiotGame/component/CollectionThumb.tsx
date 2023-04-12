import React from "react";
import { Image, TouchableOpacity } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { useCollectionInfoHeader } from "../../../hooks/useCollectionInfoHeader";
import { useAppNavigation } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";

type CollectionThumbProps = {
  collectionId: string;
};

export const CollectionThumb: React.FC<CollectionThumbProps> = ({
  collectionId,
}) => {
  const { thumb } = useCollectionInfoHeader(collectionId);
  const navigation = useAppNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("RiotGameMarketplace", { collectionId })
      }
    >
      <TertiaryBox
        mainContainerStyle={{
          paddingTop: 12,
          paddingBottom: 20,
        }}
        style={{ marginTop: layout.padding_x4 }}
        width={196}
        height={266}
      >
        <Image
          source={{ uri: thumb?.image }}
          style={{
            width: 172,
            height: 172,
            alignSelf: "center",
            borderRadius: 12,
          }}
        />
        <BrandText
          style={{ fontSize: 14 }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {thumb?.name}
        </BrandText>
      </TertiaryBox>
    </TouchableOpacity>
  );
};
