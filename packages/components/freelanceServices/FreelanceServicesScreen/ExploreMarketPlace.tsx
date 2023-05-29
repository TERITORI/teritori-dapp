import React from "react";
import { useWindowDimensions, View } from "react-native";

import BallBounce from "../../../../assets/icons/freelance-service/BallBounce.svg";
import GoToPageIcon from "../../../../assets/icons/freelance-service/ChangePage.svg";
import Code from "../../../../assets/icons/freelance-service/Code.svg";
import Computer from "../../../../assets/icons/freelance-service/Computer.svg";
import Data from "../../../../assets/icons/freelance-service/Data.svg";
import Feather from "../../../../assets/icons/freelance-service/Feather.svg";
import LifeStyle from "../../../../assets/icons/freelance-service/LifeStyle.svg";
import Music from "../../../../assets/icons/freelance-service/Music.svg";
import Pen from "../../../../assets/icons/freelance-service/Pen.svg";
import Suitcase from "../../../../assets/icons/freelance-service/Suitcase.svg";
import { FreelancerServiceRouteTypes } from "../../../screens/FreelanceServices/types/routes";
import { layout, leftMarginMainContent } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { FreelanceServicesCards } from "../Cards/FreelanceServicesCards";

const data = [
  {
    name: "Graphics & Design",
    icon: Feather,
    iconChangePage: GoToPageIcon,
    category: "GraphicsAndDesign",
  },
  {
    name: "Digital Marketing",
    icon: Computer,
    iconChangePage: GoToPageIcon,
    category: "ComingSoon",
  },
  {
    name: "Wiriting & Translation",
    icon: Pen,
    iconChangePage: GoToPageIcon,
    category: "ComingSoon",
  },
  {
    name: "Video & Animation",
    icon: BallBounce,
    iconChangePage: GoToPageIcon,
    category: "ComingSoon",
  },
  {
    name: "Music & Audio",
    icon: Music,
    iconChangePage: GoToPageIcon,
    category: "ComingSoon",
  },
  {
    name: "Dev & Tech",
    icon: Code,
    iconChangePage: GoToPageIcon,
    category: "ComingSoon",
  },
  {
    name: "Business",
    icon: Suitcase,
    iconChangePage: GoToPageIcon,
    category: "ComingSoon",
  },
  {
    name: "Lifestyle",
    icon: LifeStyle,
    iconChangePage: GoToPageIcon,
    category: "ComingSoon",
  },
  {
    name: "Data",
    icon: Data,
    iconChangePage: GoToPageIcon,
    category: "ComingSoon",
  },
] as FreelancerServiceRouteTypes[];

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
          marginTop: layout.padding_x2_5,
        }}
      >
        {data.map((item, index) => (
          <FreelanceServicesCards
            iconSVG={item.icon}
            iconNearTextSVG={item.iconChangePage}
            text={item.name}
            width={width > 1024 ? 242 : 170}
            height={156}
            boxStyle={{
              justifyContent: width > 1280 ? "flex-start" : "center",
              marginRight: layout.padding_x2,
              marginTop: layout.padding_x2,
            }}
            key={index}
            category={item.category}
          />
        ))}
      </View>
    </View>
  );
};
