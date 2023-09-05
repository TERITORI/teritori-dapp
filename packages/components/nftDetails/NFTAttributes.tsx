import React, { useState } from "react";
import { View } from "react-native";

import { AttributeRarityFloor } from "../../api/marketplace/v1/marketplace";
import { useIsMobile } from "../../hooks/useIsMobile";
import { neutral33 } from "../../utils/style/colors";
import { NFTInfo } from "../../utils/types/nft";
import { ToggleableButton } from "../buttons/ToggleableButton";
import { NFTAttributeCard } from "../cards/NFTAttributeCard";

const previewCount = 9;

export const NFTAttributes: React.FC<{
  nftAttributes?: AttributeRarityFloor[];
  nftInfo: NFTInfo;
}> = ({ nftAttributes = [], nftInfo }) => {
  const [isMoreDisplayed, setIsMoreDisplayed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <View
        style={{
          flexWrap: "wrap",
          flexDirection: "row",
          maxWidth: isMobile ? 418 : undefined,
          margin: -6,
        }}
      >
        {/*No marginRight for NFTAttributeCard if the Card is at the last column (We use modulo of 3 because we have (not explicitly) 3 columns*/}
        {/*TODO: Responsive*/}
        {(isMoreDisplayed
          ? nftAttributes
          : nftAttributes.slice(0, previewCount)
        ).map((attribute, index) => (
          <NFTAttributeCard
            key={index}
            nftAttribute={attribute}
            nftInfo={nftInfo}
            style={{
              margin: 6,
            }}
          />
        ))}
      </View>

      {nftAttributes.length > previewCount && (
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 12,
          }}
        >
          <View style={{ height: 1, width: 240, backgroundColor: neutral33 }} />
          <ToggleableButton
            textCompressed="Show more"
            textExpanded="Show less"
            onPress={() => setIsMoreDisplayed(!isMoreDisplayed)}
            isExpanded={isMoreDisplayed}
          />
          <View style={{ height: 1, width: 240, backgroundColor: neutral33 }} />
        </View>
      )}
    </>
  );
};
