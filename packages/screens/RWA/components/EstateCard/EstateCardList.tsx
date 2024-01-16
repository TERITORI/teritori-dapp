import React, { useMemo } from "react";
import { View, FlatList, TextStyle } from "react-native";

import { EstateCard } from "./EstateCard";
import { ShowMoreButton } from "./ShowMoreButton";
import { EstateCardListProps, EstateCardProps } from "./types";
import EstateIcon from "../../../../../assets/icons/estate.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { useIsMobile } from "../../../../hooks/useIsMobile";
import { useTheme } from "../../../../hooks/useTheme";
import { neutralA3 } from "../../../../utils/style/colors";
import { fontSemibold20 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { useIsRWAListThreshold } from "../../useIsRWAListThreshold";

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

const EstateCardListEmpty: React.FC = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.borderColor,
        height: 64,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layout.spacing_x1_5,
        }}
      >
        <SVG source={EstateIcon} width={24} height={24} color={neutralA3} />
        <BrandText style={[{ fontSize: 18, color: neutralA3 }]}>
          No available estates
        </BrandText>
      </View>
    </View>
  );
};

const EstateCardListFilled: React.FC<{
  cards: EstateCardProps[];
}> = ({ cards }) => {
  const isMobile = useIsMobile();
  return isMobile ? (
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
      data={cards}
      renderItem={({ item, index }) => (
        <EstateCard
          style={{ marginLeft: index === 0 ? 0 : 16 }}
          key={item.card.id}
          {...item}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export const EstateCardList: React.FC<EstateCardListProps> = ({
  cards,
  title,
  style,
}) => {
  const isRWAListThreshold = useIsRWAListThreshold();

  const maxItems = useMemo(
    () => (isRWAListThreshold ? 2 : 3),
    [isRWAListThreshold],
  );

  return (
    <View style={[style]}>
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <BrandText style={[ListTitleCStyle]}>{title}</BrandText>
          {cards.length > maxItems && <ShowMoreButton />}
        </View>
        {cards.length ? (
          <EstateCardListFilled cards={cards} />
        ) : (
          <EstateCardListEmpty />
        )}
      </View>
    </View>
  );
};

const ListTitleCStyle: TextStyle = {
  marginBottom: layout.spacing_x3,
  ...fontSemibold20,
};
