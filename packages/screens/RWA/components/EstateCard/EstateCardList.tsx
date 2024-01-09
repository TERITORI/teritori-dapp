import React, { useState } from "react";
import { View, FlatList, TextStyle, useWindowDimensions } from "react-native";

import { EstateCard } from "./EstateCard";
import { EstateCardListProps, EstateCardProps } from "./types";
import { BrandText } from "../../../../components/BrandText";
import { useIsMobile } from "../../../../hooks/useIsMobile";
import { fontSemibold20 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

export const getEstateCardList: (
  isComingSoon?: boolean,
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

export const EstateCardList: React.FC<EstateCardListProps> = ({
  cards,
  title,
  style,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const [flatListWidth, setFlatListWidth] = useState<number>(0);
  const isMobile = useIsMobile();

  return (
    <View
      style={{
        ...style,
        // center content to fit with large screens
        alignItems:
          flatListWidth < windowWidth || isMobile ? "center" : undefined,
      }}
    >
      <View>
        <BrandText style={[ListTitleCStyle, { marginLeft: isMobile ? 0 : 60 }]}>
          {title}
        </BrandText>
        {isMobile ? (
          <View style={{ flexDirection: "column" }}>
            {cards.map((value, index) => (
              <EstateCard
                style={{ marginBottom: index + 1 <= cards.length ? 15 : 0 }}
                key={value.card.id}
                {...value}
              />
            ))}
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{ paddingHorizontal: 40 }}
            data={cards}
            renderItem={({ item, index }) => (
              <EstateCard
                style={{ marginLeft: index === 0 ? 20 : 24 }}
                key={item.card.id}
                {...item}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            onContentSizeChange={(width) => setFlatListWidth(width)}
          />
        )}
      </View>
    </View>
  );
};

const ListTitleCStyle: TextStyle = {
  marginBottom: layout.spacing_x3,
  ...fontSemibold20,
};
