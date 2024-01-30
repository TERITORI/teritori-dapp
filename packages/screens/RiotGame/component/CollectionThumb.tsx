import React from "react";
import { TouchableOpacity } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { OptimizedImage } from "../../../components/OptimizedImage";
import { LegacyTertiaryBox } from "../../../components/boxes/LegacyTertiaryBox";
import { useCollectionInfo } from "../../../hooks/useCollectionInfo";
import { layout } from "../../../utils/style/layout";

import { router } from "@/utils/router";

type CollectionThumbProps = {
  collectionId: string;
};

export const CollectionThumb: React.FC<CollectionThumbProps> = ({
  collectionId,
}) => {
  const { collectionInfo: info } = useCollectionInfo(collectionId);

  return (
    <TouchableOpacity
      onPress={() =>
        router.navigate({
          pathname: "/riot-game/marketplace",
          params: { collectionId },
        })
      }
    >
      <LegacyTertiaryBox
        mainContainerStyle={{
          paddingTop: 12,
          paddingBottom: 20,
        }}
        style={{ marginTop: layout.spacing_x4 }}
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
      </LegacyTertiaryBox>
    </TouchableOpacity>
  );
};
