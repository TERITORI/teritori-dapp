import React from "react";
import { View, TouchableOpacity, useWindowDimensions } from "react-native";

import chevronLeft from "../../../../assets/icons/chevron-left.svg";
import chevronRight from "../../../../assets/icons/chevron-right.svg";
import GoToPageIcon from "../../../../assets/icons/freelance-service/ChangePage.svg";
import diamond from "../../../../assets/icons/freelance-service/diamond.svg";
import glasses from "../../../../assets/icons/glasses.svg";
import halfStar from "../../../../assets/icons/half-star.svg";
import house from "../../../../assets/icons/house.svg";
import imageEditing from "../../../../assets/icons/image-editing.svg";
import { FreelancerServiceRouteTypes } from "../../../screens/FreelanceServices/types/routes";
import { layout, leftMarginMainContent } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { FreelanceServicesCards } from "../Cards/FreelanceServicesCards";

const data = [
  {
    name: "Logo Design",
    icon: diamond,
    iconChangePage: GoToPageIcon,
    navigation: "LogoDesign",
  },
  {
    name: "Architecture & \nInterior Design",
    icon: house,
    iconChangePage: GoToPageIcon,
    navigation: "ComingSoon",
  },
  {
    name: "Image Editing",
    icon: imageEditing,
    iconChangePage: GoToPageIcon,
    navigation: "ComingSoon",
  },
  {
    name: "NFT Art",
    icon: halfStar,
    iconChangePage: GoToPageIcon,
    navigation: "ComingSoon",
  },
  {
    name: "Merch Design",
    icon: glasses,
    iconChangePage: GoToPageIcon,
    navigation: "ComingSoon",
  },
] as FreelancerServiceRouteTypes[];

export const PopularDesignExplorer: React.FC = () => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        flexDirection: "column",
        width: "100%",
        alignSelf: "center",
        paddingHorizontal: leftMarginMainContent,
      }}
    >
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
          // justifyContent: "space-between",
        }}
      >
        {data.map((item, index) => (
          <FreelanceServicesCards
            iconSVG={item.icon}
            iconNearTextSVG={item.iconChangePage}
            text={item.name}
            width={width > 1024 ? 242 : 180}
            height={156}
            boxStyle={{ margin: layout.padding_x1 }}
            key={index}
            navigation={item.navigation}
          />
        ))}
      </View>
    </View>
  );
};
