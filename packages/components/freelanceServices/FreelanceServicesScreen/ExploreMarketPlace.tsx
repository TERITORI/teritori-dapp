import React from "react";
import { useWindowDimensions, View } from "react-native";

import { Card } from "../../../screens/FreelanceServices/query/data";
import { layout, leftMarginMainContent } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { FreelanceServicesCards } from "../Cards/FreelanceServicesCards";

export const CardsSection: React.FC<{ cards: Card[]; title: string }> = ({
  cards,
  title,
}) => {
  console.log(cards);
  const { width } = useWindowDimensions();
  return (
    <View
      style={{
        flexDirection: "column",
        alignSelf: "center",
        width: "100%",
        paddingHorizontal: leftMarginMainContent,
        justifyContent: "flex-start",
      }}
    >
      <BrandText style={{ alignSelf: "center", width: "100%", marginTop: 40 }}>
        {title}
      </BrandText>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: width > 1280 ? "flex-start" : "center",
          alignSelf: "center",
          width: "100%",
          marginTop: layout.spacing_x2_5,
        }}
      >
        {cards.map((item, index) => (
          <FreelanceServicesCards
            iconSVG={item.icon}
            text={item.title}
            width={width > 1024 ? 242 : 170}
            height={156}
            boxStyle={{
              justifyContent: width > 1280 ? "flex-start" : "center",
              marginRight: layout.spacing_x2,
              marginTop: layout.spacing_x2,
            }}
            key={index}
            category={item.name}
          />
        ))}
      </View>
    </View>
  );
};
