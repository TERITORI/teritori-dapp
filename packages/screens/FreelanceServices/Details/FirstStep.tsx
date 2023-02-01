import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { Image, ImageBackground, View } from "react-native";

import backgroundPic from "../../../../assets/banners/freelance-service/background-pic.png";
import profilePic from "../../../../assets/banners/freelance-service/profile-pic.png";
import checkIcon from "../../../../assets/icons/blue-check.svg";
import star from "../../../../assets/icons/yellow-star.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import {
  primaryColor,
  neutral77,
  neutral00,
  yellowDefault,
  neutral33,
} from "../../../utils/style/colors";
import {
  fontSemibold16,
  fontSemibold20,
  fontSemibold28,
  fontMedium14,
  fontSemibold14,
} from "../../../utils/style/fonts";

const title = [
  "Extra Fast 2 Days Delivery",
  "Additional revision",
  "Include social media kit",
  "Stationery designs",
  "Additional logo",
  "Full Vector Package",
  "Favicon Design",
  "E Mail Signature",
  "Full Color Codes",
  "Branding Design",
  "Logo Guidelines",
];

const text = [
  "",
  "Add an additional revision your seller will provide after the delivery.",
  "You'll get graphics showing your logo that you can use on social media platforms. Ex. Facebook and Instagram.",
  "You'll get a template with your logo to use for stationary—letterhead, envelopes, business cards, etc.",
  "Add another (1) logo concept.",
  "I will provide full HQ resolution logo files in 5000 X 5000 Vector AI EPS PDF JPG PNG on transparent BG",
  "I will design favicon for your Website",
  "I will design E-Mail signature for digital branding",
  "I will provide color codes in HEX RGB and CMYK for the final logo",
  "I will design double sided business card and letterhead design to build your brand",
  "I will design an outstanding Logo Guidelines",
];

export const FirstStep: React.FC = () => {
  const [checked_1, setChecked_1] = useState<boolean>();
  const [checked_2, setChecked_2] = useState<boolean>();
  const [checked_3, setChecked_3] = useState<boolean>();
  const [checked_4, setChecked_4] = useState<boolean>();
  const [checked_5, setChecked_5] = useState<boolean>();
  const [checked_6, setChecked_6] = useState<boolean>();
  const [checked_7, setChecked_7] = useState<boolean>();
  const [checked_8, setChecked_8] = useState<boolean>();
  const [checked_9, setChecked_9] = useState<boolean>();
  const [checked_10, setChecked_10] = useState<boolean>();
  const [checked_11, setChecked_11] = useState<boolean>();

  const itemCheckedFunction: any = [
    setChecked_1,
    setChecked_2,
    setChecked_3,
    setChecked_4,
    setChecked_5,
    setChecked_6,
    setChecked_7,
    setChecked_8,
    setChecked_9,
    setChecked_10,
    setChecked_11,
  ];
  const itemCheckedValue: any = [
    checked_1,
    checked_2,
    checked_3,
    checked_4,
    checked_5,
    checked_6,
    checked_7,
    checked_8,
    checked_9,
    checked_10,
    checked_11,
  ];

  return (
    <View>
      <View style={{ flexDirection: "row", marginTop: 24, display: "flex" }}>
        <ImageBackground
          source={backgroundPic}
          style={{ width: 148, height: 148 }}
        />
        <View style={{ padding: 20 }}>
          <BrandText style={[fontSemibold28]}>
            I will design 3 modern minimalist logo designs
          </BrandText>
          <BrandText style={[fontSemibold16, { marginTop: 12 }]}>
            1500 TORI
          </BrandText>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <Image
              source={profilePic}
              style={{ width: 32, height: 32, marginRight: 12 }}
            />
            <BrandText style={[fontMedium14, { marginRight: 12 }]}>
              @username
            </BrandText>
            <BrandText style={[{ color: yellowDefault }, fontMedium14]}>
              Top Rated Seller
            </BrandText>
            <View
              style={{
                width: 24,
                borderColor: neutral33,
                borderWidth: 0.5,
                transform: [{ rotate: "90deg" }],
              }}
            />
            <SVG source={star} width={24} height={24} />
            <SVG source={star} width={24} height={24} />
            <SVG source={star} width={24} height={24} />
            <SVG source={star} width={24} height={24} />
            <SVG source={star} width={24} height={24} />
            <BrandText
              style={[{ color: yellowDefault, marginRight: 12 }, fontMedium14]}
            >
              4.9
            </BrandText>
            <BrandText style={[{ color: neutral77 }, fontMedium14]}>
              (40,543)
            </BrandText>
            <View
              style={{
                width: 24,
                borderColor: neutral33,
                borderWidth: 0.5,
                transform: [{ rotate: "90deg" }],
              }}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: neutral33,
          marginTop: 24,
        }}
      />
      <BrandText style={[fontSemibold16, { marginTop: 24 }]}>
        What's included
      </BrandText>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 12,
        }}
      >
        {title.map((item, index) => (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            {itemCheckedValue[index] && (
              <SVG
                source={checkIcon}
                width={16}
                height={16}
                style={{ marginRight: 12 }}
              />
            )}
            {itemCheckedValue[index] && (
              <BrandText
                style={[fontSemibold14, { color: neutral77, marginRight: 24 }]}
              >
                {item}
              </BrandText>
            )}
          </View>
        ))}
      </View>
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: neutral33,
          marginTop: 24,
          marginBottom: 24,
        }}
      />
      <BrandText style={[fontSemibold20]}>
        Upgrade your order with extras
      </BrandText>
      {title.map((item: string, index: number) => (
        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 24,
              justifyContent: "space-between",
              width: "800px",
            }}
          >
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Checkbox
                style={{
                  borderColor: neutral33,
                  borderWidth: 1,
                  width: 24,
                  height: 24,
                  marginRight: 24,
                }}
                color={itemCheckedValue[index] ? primaryColor : neutral00}
                value={itemCheckedValue[index]}
                onValueChange={itemCheckedFunction[index]}
              />
              <BrandText
                style={[fontSemibold16, { height: 24, lineHeight: 24 }]}
              >
                {item}
              </BrandText>
            </View>
            <BrandText style={[fontSemibold16]}>500 TORI</BrandText>
          </View>
          <BrandText
            style={[
              fontSemibold14,
              { color: neutral77, marginTop: 6, marginLeft: 48 },
            ]}
          >
            {text[index]}
          </BrandText>
        </View>
      ))}
    </View>
  );
};
