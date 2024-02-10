import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { AttributeRarityFloor } from "../../api/marketplace/v1/marketplace";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { prettyPrice } from "../../utils/coins";
import {
  fontBold11,
  fontMedium14,
  fontSemibold12,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { NFTInfo } from "../../utils/types/nft";
import { BrandText } from "../BrandText";
import { LegacyTertiaryBox } from "../boxes/LegacyTertiaryBox";

import { resolveColor } from "@/utils/marketplace";

// TODO: Dynamic data + props

export const NFTAttributeCard: React.FC<{
  nftAttribute: AttributeRarityFloor;
  nftInfo: NFTInfo;
  style?: StyleProp<ViewStyle>;
}> = ({ nftAttribute, nftInfo, style }) => {
  const isMobile = useIsMobile();
  const { width } = useMaxResolution({ responsive: true, noMargin: true });

  return (
    nftAttribute &&
    nftInfo && (
      <LegacyTertiaryBox
        height={92}
        width={isMobile && width < 380 ? 158 : 192}
        style={style}
        mainContainerStyle={{
          padding: 12,
          alignItems: "flex-start",
          backgroundColor: resolveColor(
            "backgroundColor",
            nftAttribute.rareRatio,
          ),
        }}
      >
        <BrandText
          style={[
            fontSemibold12,
            { color: resolveColor("color", nftAttribute.rareRatio) },
          ]}
        >
          {nftAttribute.traitType}
        </BrandText>
        <BrandText
          style={[
            fontMedium14,
            {
              marginTop: layout.spacing_x0_5,
              color: resolveColor("color", nftAttribute.rareRatio),
            },
          ]}
        >
          {nftAttribute.value}
        </BrandText>

        <View
          style={{
            flexDirection: "row",
            marginTop: layout.spacing_x0_5,
          }}
        >
          <BrandText
            style={[
              fontSemibold12,
              {
                color: resolveColor("color", nftAttribute.rareRatio),
                marginRight: layout.spacing_x0_5,
              },
            ]}
          >
            {prettyPrice(
              nftInfo.networkId,
              nftAttribute.floor + "",
              nftInfo.mintDenom,
            )}
          </BrandText>
          <BrandText
            style={[
              fontSemibold12,
              { color: resolveColor("color", nftAttribute.rareRatio) },
            ]}
          >
            Floor
          </BrandText>
        </View>
        <BrandText
          style={[
            {
              marginTop: layout.spacing_x0_5,
              color: resolveColor("color", nftAttribute.rareRatio),
            },
            fontBold11,
          ]}
        >
          {nftAttribute.rareRatio.toFixed(2)}%
        </BrandText>
      </LegacyTertiaryBox>
    )
  );
};
