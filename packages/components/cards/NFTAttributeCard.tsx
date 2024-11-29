import moment from "moment";
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
import { NFTAttribute, NFTInfo } from "../../utils/types/nft";
import { BrandText } from "../BrandText";
import { LegacyTertiaryBox } from "../boxes/LegacyTertiaryBox";

import { resolveColor } from "@/utils/marketplace";

export const NFTAttributeCard: React.FC<{
  nftAttributeRarity: AttributeRarityFloor;
  nftAttribute?: NFTAttribute;
  nftInfo: NFTInfo;
  style?: StyleProp<ViewStyle>;
}> = ({ nftAttributeRarity, nftAttribute, nftInfo, style }) => {
  const isMobile = useIsMobile();
  const { width } = useMaxResolution({ responsive: true, noMargin: true });

  return (
    <LegacyTertiaryBox
      width={isMobile && width < 380 ? 158 : 192}
      style={style}
      mainContainerStyle={{
        padding: 12,
        alignItems: "flex-start",
        backgroundColor: resolveColor(
          "backgroundColor",
          nftAttributeRarity.rareRatio,
        ),
      }}
    >
      <BrandText
        numberOfLines={1}
        style={[
          fontSemibold12,
          { color: resolveColor("color", nftAttributeRarity.rareRatio) },
        ]}
      >
        {nftAttributeRarity.traitType}
      </BrandText>
      <BrandText
        numberOfLines={1}
        style={[
          fontMedium14,
          {
            marginTop: layout.spacing_x0_5,
            color: resolveColor("color", nftAttributeRarity.rareRatio),
          },
        ]}
      >
        {nftAttribute
          ? prettyAttributeValue(nftAttribute)
          : nftAttributeRarity.value}
      </BrandText>

      <View
        style={{
          flexDirection: "row",
          marginTop: layout.spacing_x0_5,
        }}
      >
        <BrandText
          numberOfLines={1}
          style={[
            fontSemibold12,
            {
              color: resolveColor("color", nftAttributeRarity.rareRatio),
              marginRight: layout.spacing_x0_5,
            },
          ]}
        >
          {prettyPrice(
            nftInfo.networkId,
            nftAttributeRarity.floor + "",
            nftInfo.mintDenom,
          )}
        </BrandText>
        <BrandText
          numberOfLines={1}
          style={[
            fontSemibold12,
            { color: resolveColor("color", nftAttributeRarity.rareRatio) },
          ]}
        >
          Floor
        </BrandText>
      </View>
      <BrandText
        numberOfLines={1}
        style={[
          {
            marginTop: layout.spacing_x0_5,
            color: resolveColor("color", nftAttributeRarity.rareRatio),
          },
          fontBold11,
        ]}
      >
        {nftAttributeRarity.rareRatio.toFixed(2)}%
      </BrandText>
    </LegacyTertiaryBox>
  );
};

const prettyAttributeValue = (attr: NFTAttribute): string => {
  if (attr.display_type === "date") {
    return moment(parseInt(attr.value, 10) * 1000).calendar();
  } else if (attr.display_type === "duration") {
    const days = moment.duration(parseInt(attr.value, 10) * 1000).asDays();
    return days + " day" + (days > 1 ? "s" : "");
  }
  return attr.value;
};
