import React, { useState } from "react";
import { View } from "react-native";

import { neutral33 } from "../../utils/style/colors";
import { NFTAttribute } from "../../utils/types/nft";
import { DropdownButton } from "../buttons/DropdownButton";
import { NFTAttributeCard } from "../cards/NFTAttributeCard";

export const NFTAttributes: React.FC<{
  nftAttributes?: NFTAttribute[];
}> = ({ nftAttributes = [] }) => {
  const [isMoreDisplayed, setIsMoreDisplayed] = useState(false);

  return (
    <>
      <View
        style={{
          flexWrap: "wrap",
          flexDirection: "row",
          width: "100%",
        }}
      >
        {/*No marginRight for NFTAttributeCard if the Card is at the last column (We use modulo of 3 because we have (not explicitly) 3 columns*/}
        {/*TODO: Responsive*/}
        {isMoreDisplayed
          ? nftAttributes.map((attribute, index) => (
              <NFTAttributeCard
                key={index}
                nftAttribute={attribute}
                style={{
                  marginBottom: 12,
                  marginRight: (index + 1) % 3 === 0 ? 0 : 12,
                }}
              />
            ))
          : nftAttributes.slice(0, 9).map((attribute, index) => (
              <NFTAttributeCard
                key={index}
                nftAttribute={attribute}
                style={{
                  marginBottom: 12,
                  marginRight: (index + 1) % 3 === 0 ? 0 : 12,
                }}
              />
            ))}
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ height: 1, width: 240, backgroundColor: neutral33 }} />
        <DropdownButton
          textCompressed="Show more"
          textExpanded="Show less"
          onPress={() => setIsMoreDisplayed(!isMoreDisplayed)}
          isExpanded={isMoreDisplayed}
        />
        <View style={{ height: 1, width: 240, backgroundColor: neutral33 }} />
      </View>
    </>
  );
};
