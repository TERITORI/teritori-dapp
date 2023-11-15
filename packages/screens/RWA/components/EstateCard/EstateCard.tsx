import React from "react";
import { View } from "react-native";

import { EstateCardImage } from "./EstateCardImage";
import { EstateCardInformations } from "./EstateCardInformations";
import { EstateCardProps, EstateCardTagsProps } from "./types";
import EstatePlaceholder from "../../../../../assets/default-images/estate-placeholder.png";
import { TertiaryBadge } from "../../../../components/badges/TertiaryBadge";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { useTheme } from "../../../../hooks/useTheme";

export const EstateCardTags: React.FC<EstateCardTagsProps> = ({ tags }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 10,
      }}
    >
      {tags.map((value, index) => {
        return (
          <TertiaryBadge
            label={value}
            style={{
              marginLeft: index !== 0 ? 6 : 0,
            }}
          />
        );
      })}
    </View>
  );
};

export const EstateCard: React.FC<EstateCardProps> = ({ tags, card }) => {
  const theme = useTheme();
  return (
    <TertiaryBox
      mainContainerStyle={{
        borderColor: theme.borderColor,
        backgroundColor: theme.backgroundColor,
        padding: 20,
      }}
      style={{ marginLeft: 20 }}
      squaresBackgroundColor={theme.backgroundColor}
      width={580}
      height={327}
    >
      <View style={{ flex: 1 }}>
        <EstateCardTags tags={tags} />
        <View style={{ flex: 1, flexDirection: "row", marginTop: 5 }}>
          <EstateCardInformations card={card} />
          <EstateCardImage sourceURI={EstatePlaceholder} />
        </View>
      </View>
    </TertiaryBox>
  );
};
