import React from "react";
import { TouchableOpacity } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { OptimizedImage } from "../../../components/OptimizedImage";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { useCollectionInfo } from "../../../hooks/useCollectionInfo";
import { useAppNavigation } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";

type CollectionThumbProps = {
  collectionId: string;
};

export const CollectionThumb: React.FC<CollectionThumbProps> = ({
  collectionId,
}) => {
  const { collectionInfo: info } = useCollectionInfo(collectionId);
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
        <OptimizedImage
          sourceURI={info?.image}
          style={{
            width: 172,
            height: 172,
            alignSelf: "center",
            borderRadius: 12,
          }}
          width={172}
          height={172}
        />
        <BrandText
          style={{ fontSize: 14 }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {info?.name}
        </BrandText>
      </TertiaryBox>
    </TouchableOpacity>
  );
};
