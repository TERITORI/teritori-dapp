import React from "react";
import { ImageBackground, View } from "react-native";
import { BrandText } from "../../../components/BrandText";
import {
  primaryColor,
  neutral77,
  neutral00,
  neutral33,
} from "../../../utils/style/colors";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import {
  fontMedium14,
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import backgroundPic from "../../../../assets/banners/freelance-service/background-pic.png";
import checkIcon from "../../../../assets/icons/blue-check.svg";
import { SVG } from "../../../components/SVG";

const checkFirst = [
  "4 concepts included",
  "Logo transparency",
  "Vector file",
  "Printable file",
  "Include 3D Mockup",
  "Include source file",
  "Include social media kit",
];

const checkSecond = [
  "Include social media kit",
  "Full Vector Package",
  "Full Color Codes",
];

export const SecondRightCard: React.FC = () => {
  return (
    <TertiaryBox width={440}>
      <View
        style={{
          padding: 20,
          width: 400,
        }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <ImageBackground
            source={backgroundPic}
            style={{ width: 88, height: 88, marginRight: 24 }}
          />
          <BrandText style={[fontSemibold20]}>
            I will design 3 modern minimalist logo designs
          </BrandText>
        </View>
        <View
          style={{ height: 1, backgroundColor: neutral33, marginTop: 20 }}
        />
        <View>
          <View
            style={{
              display: "flex",
              marginTop: 20,
              marginBottom: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <BrandText style={[fontSemibold20]}>The Cub Packages</BrandText>
            <BrandText style={[fontSemibold20]}>1500 TORI</BrandText>
          </View>

          {checkFirst.map((item) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: 12,
              }}
            >
              <SVG
                source={checkIcon}
                width={16}
                height={16}
                style={{ marginRight: 12 }}
              />
              <BrandText
                style={[fontSemibold16, { color: neutral77, marginRight: 24 }]}
              >
                {item}
              </BrandText>
            </View>
          ))}

          <View
            style={{
              height: 1,
              backgroundColor: neutral33,
              marginTop: 20,
              marginBottom: 8,
            }}
          />

          {checkSecond.map((item) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: 12,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <SVG
                  source={checkIcon}
                  width={16}
                  height={16}
                  style={{ marginRight: 12 }}
                />
                <BrandText style={[fontSemibold16, { color: neutral77 }]}>
                  {item}
                </BrandText>
              </View>
              <BrandText style={[fontSemibold14]}>500 TORI</BrandText>
            </View>
          ))}

          <View
            style={{ height: 1, backgroundColor: neutral33, marginTop: 20 }}
          />
          <View
            style={{
              display: "flex",
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <BrandText style={[fontSemibold20, { color: neutral77 }]}>
              SUbtotal
            </BrandText>
            <BrandText style={[fontSemibold20]}>3000 TORI</BrandText>
          </View>
          <View
            style={{
              display: "flex",
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <BrandText style={[fontSemibold20, { color: neutral77 }]}>
              Service Fee
            </BrandText>
            <BrandText style={[fontSemibold20]}>150 TORI</BrandText>
          </View>
          <View
            style={{ height: 1, backgroundColor: neutral33, marginTop: 20 }}
          />
          <View
            style={{
              display: "flex",
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <BrandText style={[fontSemibold20, { color: neutral77 }]}>
              Total
            </BrandText>
            <BrandText style={[fontSemibold20]}>3150 TORI</BrandText>
          </View>
          <View
            style={{
              display: "flex",
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <BrandText style={[fontSemibold20, { color: neutral77 }]}>
              Delivery Time
            </BrandText>
            <BrandText style={[fontSemibold20]}>3 days</BrandText>
          </View>
        </View>
        <SecondaryButton
          text="Confirm & Pay"
          size="SM"
          fullWidth
          color={neutral00}
          backgroundColor={primaryColor}
          style={{ marginTop: 24, marginBottom: 20 }}
        />
        <BrandText
          style={[fontMedium14, { color: neutral77, textAlign: "center" }]}
        >
          You will be charged 3150 TORI.
        </BrandText>
      </View>
    </TertiaryBox>
  );
};
