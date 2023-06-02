import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { AttributeRarityFloor } from "../../api/marketplace/v1/marketplace";
import { NFTInfo } from "../../screens/Marketplace/NFTDetailScreen";
import { resolveColor } from "../../screens/Marketplace/utils";
import { prettyPrice } from "../../utils/coins";
import {
  fontBold11,
  fontMedium14,
  fontSemibold12,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { CurrencyIcon } from "../CurrencyIcon";
import { TertiaryBox } from "../boxes/TertiaryBox";

// TODO: Dynamic data + props

export const NFTAttributeCard: React.FC<{
  nftAttribute: AttributeRarityFloor;
  nftInfo: NFTInfo;
  style?: StyleProp<ViewStyle>;
}> = ({ nftAttribute, nftInfo, style }) => {
  return (
    nftAttribute && (
      <TertiaryBox
        height={92}
        width={192}
        style={style}
        mainContainerStyle={{
          padding: 12,
          alignItems: "flex-start",
          backgroundColor: resolveColor(
            "backgroundColor",
            nftAttribute.rareRatio
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
              marginTop: layout.padding_x0_5,
              color: resolveColor("color", nftAttribute.rareRatio),
            },
          ]}
        >
          {nftAttribute.value}
        </BrandText>

        <View
          style={{
            flexDirection: "row",
            marginTop: layout.padding_x0_5,
          }}
        >
          <BrandText
            style={[
              fontSemibold12,
              { color: resolveColor("color", nftAttribute.rareRatio) },
            ]}
          >
            {prettyPrice(
              nftInfo.networkId,
              nftAttribute.floor + "",
              nftInfo.priceDenom
            )}
          </BrandText>
          <CurrencyIcon
            networkId={nftInfo.networkId}
            denom={nftInfo.priceDenom}
            size={16}
          />
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
              marginTop: layout.padding_x0_5,
              color: resolveColor("color", nftAttribute.rareRatio),
            },
            fontBold11,
          ]}
        >
          {nftAttribute.rareRatio.toFixed(2)}%
        </BrandText>
      </TertiaryBox>
    )
  );
};
