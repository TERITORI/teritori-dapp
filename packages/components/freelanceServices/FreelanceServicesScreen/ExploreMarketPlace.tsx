import React from "react";
import { View } from "react-native";

import BallBounce from "../../../../assets/icons/freelance-service/BallBounce.svg";
import GoToPageIcon from "../../../../assets/icons/freelance-service/ChangePage.svg";
import Code from "../../../../assets/icons/freelance-service/Code.svg";
import Computer from "../../../../assets/icons/freelance-service/Computer.svg";
import Data from "../../../../assets/icons/freelance-service/Data.svg";
import Feather from "../../../../assets/icons/freelance-service/Feather.svg";
import LifeStyle from "../../../../assets/icons/freelance-service/LifeStyle.svg";
import Music from "../../../../assets/icons/freelance-service/Music.svg";
import Pen from "../../../../assets/icons/freelance-service/Pen.svg";
import Suitecase from "../../../../assets/icons/freelance-service/Suitecase.svg";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { FreelanceServicesCards } from "../Cards/FreelanceServicesCards";

const data = [
  {
    name: "Graphics & Design",
    icon: Feather,
    iconChangePage: GoToPageIcon,
    navigation: "GraphicsAndDesign",
  },
  {
    name: "Digital Marketing",
    icon: Computer,
    iconChangePage: GoToPageIcon,
    navigation: "",
  },
  {
    name: "Wiriting & Translation",
    icon: Pen,
    iconChangePage: GoToPageIcon,
    navigation: "",
  },
  {
    name: "Video & Animation",
    icon: BallBounce,
    iconChangePage: GoToPageIcon,
    navigation: "",
  },
  {
    name: "Music & Audio",
    icon: Music,
    iconChangePage: GoToPageIcon,
    navigation: "",
  },
  {
    name: "Dev & Tech",
    icon: Code,
    iconChangePage: GoToPageIcon,
    navigation: "",
  },
  {
    name: "Business",
    icon: Suitecase,
    iconChangePage: GoToPageIcon,
    navigation: "",
  },
  {
    name: "Lifestyle",
    icon: LifeStyle,
    iconChangePage: GoToPageIcon,
    navigation: "",
  },
  {
    name: "Data",
    icon: Data,
    iconChangePage: GoToPageIcon,
    navigation: "",
  },
];

export const ExplorerMarketPlace: React.FC = () => {
  return (
    <View
      style={{
        flexDirection: "column",
        alignSelf: "center",
        width: 1290,
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
            width={242}
            height={156}
            boxStyle={{
              marginRight: layout.padding_x2,
              marginTop: layout.padding_x2,
            }}
            key={index}
            navigation={item.navigation}
          />
        ))}
      </View>
    </View>
  );
};
