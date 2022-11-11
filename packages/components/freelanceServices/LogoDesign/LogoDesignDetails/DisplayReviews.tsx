import React from "react";
import { View, Image } from "react-native";

import profilePic from "../../../../../assets/banners/freelance-service/profile-pic.png";
import usFlag from "../../../../../assets/banners/freelance-service/us-flag.png";
import star from "../../../../../assets/icons/yellow-star.svg";
import {
  yellowDefault,
  neutral77,
  neutral33,
  primaryColor,
} from "../../../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold16,
  fontSemibold14,
} from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText/BrandText";
import { SVG } from "../../../SVG";
import { TertiaryBox } from "../../../boxes/TertiaryBox";
import { SecondaryButton } from "../../../buttons/SecondaryButton";

const data = ["1", "2", "3"];

export const DisplayReviews: React.FC = () => {
  return (
    <View style={{ flexDirection: "column", marginTop: 30, marginBottom: 30 }}>
      {data.map((item, index) => (
        <TertiaryBox fullWidth key={index} style={{ marginBottom: 12 }}>
          <View
            style={{
              marginTop: 12,
              marginBottom: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              width: 710,
              alignSelf: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={profilePic}
                style={{ width: 32, height: 32, marginRight: 8 }}
              />
              <BrandText style={fontSemibold16}>@username</BrandText>
              <View
                style={{
                  width: 24,
                  height: 0,
                  borderColor: neutral33,
                  borderWidth: 0.5,
                  transform: [{ rotate: "90deg" }],
                }}
              />
              <Image
                source={usFlag}
                style={{ width: 21, height: 15, marginRight: 8 }}
              />
              <BrandText style={[{ color: neutral77 }, fontSemibold14]}>
                United States
              </BrandText>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <SVG source={star} width={24} height={24} />
              <SVG source={star} width={24} height={24} />
              <SVG source={star} width={24} height={24} />
              <SVG source={star} width={24} height={24} />
              <SVG source={star} width={24} height={24} />
              <BrandText
                style={[{ color: yellowDefault, marginLeft: 12 }, fontMedium14]}
              >
                4.9
              </BrandText>
              <View
                style={{
                  width: 24,
                  height: 0,
                  borderColor: neutral33,
                  borderWidth: 0.5,
                  transform: [{ rotate: "90deg" }],
                }}
              />
              <BrandText style={[{ color: neutral77 }, fontSemibold14]}>
                2 month ago
              </BrandText>
            </View>
          </View>
          <View style={{ width: 650, marginBottom: 12 }}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              Username was great! We commissioned him for a logo for an upcoming
              education-based NGO, which I imagine is not a common request. We
              chose the Premium package, and it was well worth the cost! Good
              communication from start to finish. Five designs were lorem ipsum
              lorem ipsum dolor sit amet dolor lorem ipsum dolor sit am...
            </BrandText>
            <BrandText
              style={[
                fontSemibold14,
                {
                  color: primaryColor,
                  borderBottomColor: primaryColor,
                  marginTop: 8,
                  borderBottomWidth: 0.5,
                  alignSelf: "flex-start",
                },
              ]}
            >
              See more
            </BrandText>
          </View>
        </TertiaryBox>
      ))}
      <SecondaryButton
        size="SM"
        text="See More"
        style={{ alignSelf: "center", marginTop: 12 }}
      />
    </View>
  );
};
