import React from "react";
import { View, TouchableOpacity } from "react-native";

import brandBackground from "../../../../assets/banners/freelance-service/brand.png";
import cameraBackground from "../../../../assets/banners/freelance-service/cameraBackground.png";
import micBackground from "../../../../assets/banners/freelance-service/micBackground.png";
import phoneBackground from "../../../../assets/banners/freelance-service/phoneBackground.png";
import wordPressBackground from "../../../../assets/banners/freelance-service/wordPress.png";
import chevronLeft from "../../../../assets/icons/chevron-left.svg";
import chevronRight from "../../../../assets/icons/chevron-right.svg";
import { neutral77 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryCard } from "../Cards/TertiaryCard";

const data = [
  {
    firstTitle: "Build your brand",
    secondTitle: "Logo Design",
    imageBackground: brandBackground,
  },
  {
    firstTitle: "Customize your site",
    secondTitle: "WordPress",
    imageBackground: wordPressBackground,
  },
  {
    firstTitle: "Share your message",
    secondTitle: "Voice Over",
    imageBackground: micBackground,
  },
  {
    firstTitle: "Engage your audience",
    secondTitle: "Video Explainer",
    imageBackground: cameraBackground,
  },
  {
    firstTitle: "Reach more customers",
    secondTitle: "Social Media",
    imageBackground: phoneBackground,
  },
];

export const FreelanceServiceProfessionalOverview: React.FC = () => {
  return (
    <View style={{ flexDirection: "column", width: 1280, alignSelf: "center" }}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginTop: 40,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BrandText>Popular Professional Services</BrandText>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity>
            <SVG
              source={chevronLeft}
              width={18}
              height={18}
              style={{ marginRight: layout.padding_x1 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <SVG source={chevronRight} width={18} height={18} />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignSelf: "center",
          width: "100%",
          marginTop: layout.padding_x2_5,
          justifyContent: "space-between",
        }}
      >
        {data.map((item, index) => (
          <TertiaryCard
            width={240}
            height={280}
            firstTitle={item.firstTitle}
            secondTitle={item.secondTitle}
            imageBackground={item.imageBackground}
            key={index}
            firstTitleStyle={{ color: neutral77 }}
          />
        ))}
      </View>
    </View>
  );
};
