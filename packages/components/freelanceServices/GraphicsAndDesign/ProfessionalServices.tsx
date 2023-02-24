import React from "react";
import { View, TouchableOpacity } from "react-native";

import architectureBackground from "../../../../assets/banners/freelance-service/graphics-and-design/architecture.png";
import artBackground from "../../../../assets/banners/freelance-service/graphics-and-design/art.png";
import fashionBackground from "../../../../assets/banners/freelance-service/graphics-and-design/fashion.png";
import gamingBackground from "../../../../assets/banners/freelance-service/graphics-and-design/gaming.png";
import logoAndBrandBackground from "../../../../assets/banners/freelance-service/graphics-and-design/logo-and-brand.png";
import marketingBackground from "../../../../assets/banners/freelance-service/graphics-and-design/marketing-design.png";
import miscellaneousBackground from "../../../../assets/banners/freelance-service/graphics-and-design/miscellaneous.png";
import packagingBackground from "../../../../assets/banners/freelance-service/graphics-and-design/packaging.png";
import printDesignBackground from "../../../../assets/banners/freelance-service/graphics-and-design/print-design.png";
import productDesignBackground from "../../../../assets/banners/freelance-service/graphics-and-design/product-design.png";
import visualDesignBackground from "../../../../assets/banners/freelance-service/graphics-and-design/visual-design.png";
import webAndAppDevBackground from "../../../../assets/banners/freelance-service/graphics-and-design/web-and-app-dev.png";
import chevronLeft from "../../../../assets/icons/chevron-left.svg";
import chevronRight from "../../../../assets/icons/chevron-right.svg";
import { neutral77 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryCard } from "../Cards/TertiaryCard";

const data = [
  {
    descriptionTitle: "Logo & Brand Identity",
    descriptionList: [
      "Logo Design",
      "Brand Style Guides",
      "Fonts & Typography",
      "Business Cards & Stationery",
    ],
    imageBackground: logoAndBrandBackground,
  },
  {
    descriptionTitle: "Web & App Design",
    descriptionList: [
      "Website Design",
      "App Design",
      "UX Design",
      "Landing Page Design",
      "Icon Design",
    ],
    imageBackground: webAndAppDevBackground,
  },
  {
    descriptionTitle: "Art & Illustration",
    descriptionList: [
      "Illustration",
      "NFT Art",
      "Pattern Design",
      "Cartoons & Comics",
      "Storyboards",
    ],
    imageBackground: artBackground,
  },
  {
    descriptionTitle: "Marketing Design",
    descriptionList: [
      "Social Media Design",
      "Email Design",
      "Web Banners",
      "Signage Design",
    ],
    imageBackground: marketingBackground,
  },
  {
    descriptionTitle: "Gaming",
    descriptionList: ["Game Art", "Graphics for Streamers", "Twitch Store"],
    imageBackground: gamingBackground,
  },
  {
    descriptionTitle: "Visual Design",
    descriptionList: [
      "Image Editing",
      "Presentation Design",
      "Infographic Design",
      "Vector Tracing",
      "CV Design",
    ],
    imageBackground: visualDesignBackground,
  },
  {
    descriptionTitle: "Print Design",
    descriptionList: [
      "Merch Design",
      "Flyer & Brochure Design",
      "Poster Design",
      "Catalog Design",
      "Menu & Invitation Design",
    ],
    imageBackground: printDesignBackground,
  },
  {
    descriptionTitle: "Packaging & Covers",
    descriptionList: [
      "Packaging & Label Design",
      "Book Design",
      "Album Cover Design",
      "Prodast Cover Design",
      "Car Wraps",
    ],
    imageBackground: packagingBackground,
  },
  {
    descriptionTitle: "Architecture & Building Design",
    descriptionList: [
      "Architecture & Interior Design",
      "Landscape Design",
      "Building Engineering",
      "Building Information Modeling",
    ],
    imageBackground: architectureBackground,
  },
  {
    descriptionTitle: "Product & Characters Design",
    descriptionList: [
      "Industrial & Product Design",
      "Character Modeling",
      "Trade Booth Design",
    ],
    imageBackground: productDesignBackground,
  },
  {
    descriptionTitle: "Fashion & Jewelry",
    descriptionList: ["Fashion Design", "Jewelry Design"],
    imageBackground: fashionBackground,
  },
  {
    descriptionTitle: "Miscellaneous",
    descriptionList: ["Logo Maker Tool", "Design Advice", "Other"],
    imageBackground: miscellaneousBackground,
  },
];

export const ProfessionalServices: React.FC = () => {
  return (
    <View style={{ flexDirection: "column", alignSelf: "center", width: 1290 }}>
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
        <BrandText>Explore Graphics & Design</BrandText>
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
            width={300}
            height={172}
            descriptionTitle={item.descriptionTitle}
            descriptionList={item.descriptionList}
            imageBackground={item.imageBackground}
            boxStyle={{ marginTop: layout.padding_x2 }}
            key={index}
            firstTitleStyle={{ color: neutral77 }}
          />
        ))}
      </View>
    </View>
  );
};
