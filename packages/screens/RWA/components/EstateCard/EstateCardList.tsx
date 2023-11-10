import React from "react";
import { View, FlatList } from "react-native";

import { EstateCard } from "./EstateCard";
import { EstateCardListProps, EstateCardProps } from "./types";
import { BrandText } from "../../../../components/BrandText";

export const getEstateCardList: (
  isComingSoon?: boolean
) => EstateCardProps[] = (isComingSoon = false) => {
  return [
    {
      tags: ["GENESIS LAUNCH", "SINGLE PROPERTY", "META 3", "META 4"],
      card: {
        id: "0",
        title: "16 rue Thibault Chabrand, Cormeilles, 95403",
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
        title: "43 Avenue Michelet, St Leu, 32790",
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

export const getEstateCardById: (id: string) => EstateCardProps = (id) => {
  const estateCards = getEstateCardList();
  const estateCard = estateCards.find((item) => item.card.id === id);

  return estateCard || estateCards[0];
};

export const EstateCardList: React.FC<EstateCardListProps> = ({
  cards,
  title,
}) => {
  return (
    <View>
      <BrandText
        style={{
          marginBottom: 15,
          marginLeft: 60,
          marginTop: 50,
          letterSpacing: -1,
          fontSize: 20,
        }}
      >
        {title}
      </BrandText>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 40 }}
        data={cards}
        renderItem={({ item }) => <EstateCard key={item.card.id} {...item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
