import React from "react";
import { View, FlatList } from "react-native";

import { EstateCardProps, EstateCard } from "./EstateCard";
import { BrandText } from "../../../../components/BrandText";

export const getEstateCardList: (
  isComingSoon?: boolean
) => EstateCardProps[] = (isComingSoon = false) => {
  return [
    {
      tags: ["GENESIS LAUNCH", "SINGLE PROPERTY", "META 3", "META 4"],
      card: {
        id: "0",
        title: "7519 Wykes St, Detroit, MI 48210",
        totalInvestment: "96,600 USDC",
        estAPY: "11.39%",
        rentalStartDate: "December 1, 2023",
        estAPYPerToken: "5.69 USDC",
        isComingSoon,
      },
    },
    {
      tags: ["GENESIS LAUNCH", "SINGLE PROPERTY", "META 3", "META 4"],
      card: {
        id: "1",
        title: "7519 Wykes St, Detroit, MI 48210",
        totalInvestment: "96,600 USDC",
        estAPY: "11.39%",
        rentalStartDate: "December 1, 2023",
        estAPYPerToken: "5.69 USDC",
        isComingSoon,
      },
    },
    {
      tags: ["GENESIS LAUNCH", "SINGLE PROPERTY", "META 3", "META 4"],
      card: {
        id: "2",
        title: "7519 Wykes St, Detroit, MI 48210",
        totalInvestment: "96,600 USDC",
        estAPY: "11.39%",
        rentalStartDate: "December 1, 2023",
        estAPYPerToken: "5.69 USDC",
        isComingSoon,
      },
    },
  ];
};

type EstateCardListProps = {
  cards: EstateCardProps[];
  title: string;
};

export const EstateCardList: React.FC<EstateCardListProps> = ({
  cards,
  title,
}) => {
  return (
    <View>
      <BrandText
        style={{
          marginLeft: 20,
          marginBottom: 15,
          marginTop: 50,
          letterSpacing: -1,
          fontSize: 20,
        }}
      >
        {title}
      </BrandText>
      <FlatList
        data={cards}
        renderItem={({ item }) => <EstateCard key={item.card.id} {...item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
