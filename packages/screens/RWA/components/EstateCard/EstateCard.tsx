import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { EstateCardImage } from "./EstateCardImage";
import {
  EstateCardInformations,
  EstateCardInformationsProps,
} from "./EstateCardInformations";
import EstatePlaceholder from "../../../../../assets/default-images/estate-placeholder.png";
import { BrandText } from "../../../../components/BrandText";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { selectIsLightTheme } from "../../../../store/slices/settings";

type EstateCardTagsProps = {
  tags: string[];
};

const EstateCardTags: React.FC<EstateCardTagsProps> = ({ tags }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 10,
      }}
    >
      {tags.map((value, index) => {
        return (
          <View
            style={{
              marginLeft: index !== 0 ? 12 : 0,
              height: 28,
              backgroundColor: "#F5F5F7",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 12,
            }}
            key={index}
          >
            <BrandText
              style={{
                color: "#777777",
                fontWeight: "200",
                fontSize: 13,
                letterSpacing: -1,
              }}
            >
              {value}
            </BrandText>
          </View>
        );
      })}
    </View>
  );
};

export type EstateCardProps = EstateCardTagsProps & EstateCardInformationsProps;

export const EstateCard: React.FC<EstateCardProps> = ({ tags, card }) => {
  const isLightTheme = useSelector(selectIsLightTheme);
  return (
    <TertiaryBox
      mainContainerStyle={{
        borderColor: isLightTheme ? "#EBEBF0" : "#000000",
        backgroundColor: isLightTheme ? "#FFFFFF" : "#000000",
        padding: 20,
      }}
      style={{ marginLeft: 20 }}
      squaresBackgroundColor={isLightTheme ? "#FFFFFF" : "#000000"}
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
