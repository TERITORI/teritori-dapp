import React from "react";
import { useWindowDimensions, View } from "react-native";

import maincat from "../../../screens/FreelanceServices/basedata/maincat.json";
import { layout, leftMarginMainContent } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { FreelanceServicesCards } from "../Cards/FreelanceServicesCards";

export const ExplorerMarketPlace: React.FC = () => {
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
        Explore the Marketplace
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
        {maincat["explore_marketplace"].map((item, index) => (
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
