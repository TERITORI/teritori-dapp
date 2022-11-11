import React from "react";
import { View, TouchableOpacity, Image } from "react-native";

import profilePic from "../../../../assets/banners/freelance-service/profile-pic.png";
import usFlag from "../../../../assets/banners/freelance-service/us-flag.png";
import chevronLeft from "../../../../assets/icons/chevron-left.svg";
import chevronRight from "../../../../assets/icons/chevron-right.svg";
import star from "../../../../assets/icons/yellow-star.svg";
import {
  neutral33,
  neutral77,
  yellowDefault,
  neutral00,
} from "../../../utils/style/colors";
import { fontMedium14, fontSemibold14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryBox } from "../../boxes/TertiaryBox";

export const ReviewCard: React.FC<object> = () => {
  return (
    <TertiaryBox fullWidth style={{ marginTop: 12 }}>
      <View style={{ width: "100%", height: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingTop: 16,
            paddingBottom: 16,
            width: "100%",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity>
            <View
              style={{
                width: 32,
                height: 32,
                backgroundColor: neutral00,
                borderColor: neutral33,
                borderWidth: 0.5,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SVG source={chevronLeft} width={16} height={16} style={{}} />
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: "column" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Image
                source={profilePic}
                style={{ width: 32, height: 32, marginRight: 8 }}
              />
              <BrandText style={fontSemibold14}>@username</BrandText>
              <View
                style={{
                  width: 24,
                  borderColor: neutral33,
                  borderWidth: 0.5,
                  transform: [{ rotate: "90deg" }],
                }}
              />
              <Image
                source={usFlag}
                style={{ width: 21, height: 15, marginRight: 8 }}
              />
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                United State
              </BrandText>
              <SVG source={star} width={24} height={24} />
              <SVG source={star} width={24} height={24} />
              <SVG source={star} width={24} height={24} />
              <SVG source={star} width={24} height={24} />
              <SVG source={star} width={24} height={24} />
              <BrandText
                style={[
                  { color: yellowDefault, marginRight: 12 },
                  fontMedium14,
                ]}
              >
                4.9
              </BrandText>
            </View>
            <BrandText style={[fontMedium14, { color: neutral77, width: 500 }]}>
              Username is a very talanted artist! I neveber like to put money
              into something that could pronetially be a time and money waste
              and sometimes you never know ...
            </BrandText>
          </View>
          <TouchableOpacity>
            <View
              style={{
                width: 32,
                height: 32,
                backgroundColor: neutral00,
                borderColor: neutral33,
                borderWidth: 0.5,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SVG source={chevronRight} width={16} height={16} style={{}} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TertiaryBox>
  );
};
