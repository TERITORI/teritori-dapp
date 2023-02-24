import React from "react";
import { View, TouchableOpacity } from "react-native";

import ava from "../../../../assets/banners/freelance-service/ava.png";
import bookDesignBackground from "../../../../assets/banners/freelance-service/book-design.png";
import illustrationBackground from "../../../../assets/banners/freelance-service/illustration.png";
import logoDesignBackground from "../../../../assets/banners/freelance-service/logo-design.png";
import martketingVideoBackground from "../../../../assets/banners/freelance-service/martketing-video.png";
import packageDesignBackground from "../../../../assets/banners/freelance-service/package-design.png";
import chevronLeft from "../../../../assets/icons/chevron-left.svg";
import chevronRight from "../../../../assets/icons/chevron-right.svg";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryCard } from "../Cards/TertiaryCard";

const data = [
  {
    firstTitle: "By @username",
    secondTitle: "Book Design",
    imageBackground: bookDesignBackground,
  },
  {
    firstTitle: "By @username",
    secondTitle: "Logo Design",
    imageBackground: logoDesignBackground,
  },
  {
    firstTitle: "By @username",
    secondTitle: "Marketing Video",
    imageBackground: martketingVideoBackground,
  },
  {
    firstTitle: "By @username",
    secondTitle: "Package Design",
    imageBackground: packageDesignBackground,
  },
  {
    firstTitle: "By @username",
    secondTitle: "Illustrations",
    imageBackground: illustrationBackground,
  },
];

export const FreelancersProjects: React.FC = () => {
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
        <BrandText>
          Get iInspired with Projects Made by our Freelancers
        </BrandText>
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
            profilePic={ava}
          />
        ))}
      </View>
    </View>
  );
};
