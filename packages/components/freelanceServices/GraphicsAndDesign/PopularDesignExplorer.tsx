import React from "react";
import { View, TouchableOpacity } from "react-native";

import chevronLeft from "../../../../assets/icons/chevron-left.svg";
import chevronRight from "../../../../assets/icons/chevron-right.svg";
import dimaond from "../../../../assets/icons/diamond.svg";
import GoToPageIcon from "../../../../assets/icons/freelance-service/ChangePage.svg";
import glasses from "../../../../assets/icons/glasses.svg";
import halfStar from "../../../../assets/icons/half-star.svg";
import house from "../../../../assets/icons/house.svg";
import imageEditing from "../../../../assets/icons/image-editing.svg";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { FreelanceServicesCards } from "../Cards/FreelanceServicesCards";

const data = [
  {
    name: "Logo Design",
    icon: dimaond,
    iconChangePage: GoToPageIcon,
    subCategory: "LogoDesign",
  },
  {
    name: "Architecture & \nInterior Design",
    icon: house,
    iconChangePage: GoToPageIcon,
    subCategory: "",
  },
  {
    name: "Image Editing",
    icon: imageEditing,
    iconChangePage: GoToPageIcon,
    subCategory: "",
  },
  {
    name: "NFT Art",
    icon: halfStar,
    iconChangePage: GoToPageIcon,
    subCategory: "",
  },
  {
    name: "Merch Design",
    icon: glasses,
    iconChangePage: GoToPageIcon,
    subCategory: "",
  },
];

export const PopularDesignExplorer: React.FC = () => {
  const categoryName = "GraphicsAndDesign";
  return (
    <View style={{ flexDirection: "column", width: 1290, alignSelf: "center" }}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginTop: 60,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BrandText>Most Popular in Graphics & Design</BrandText>
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
          <FreelanceServicesCards
            iconSVG={item.icon}
            iconNearTextSVG={item.iconChangePage}
            text={item.name}
            width={242}
            height={156}
            // boxStyle={{ margin: layout.padding_x1 }}
            key={index}
            category={categoryName}
            subCategory={item.subCategory}
          />
        ))}
      </View>
    </View>
  );
};
