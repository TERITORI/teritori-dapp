import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { FlatList, Image, ImageBackground, View } from "react-native";

import backgroundPic from "../../../../assets/banners/freelance-service/background-pic.png";
import profilePic from "../../../../assets/banners/freelance-service/profile-pic.png";
import checkIcon from "../../../../assets/icons/blue-check.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { StarRating } from "../../../components/freelanceServices/StarRating";
import {
  neutral00,
  neutral33,
  neutral77,
  primaryColor,
  yellowDefault,
} from "../../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
  fontSemibold28,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { TopRatedSeller } from "../LogoDesign/TopRatedSeller";

const title = [
  {
    text: "Extra Fast 2 Days Delivery",
    subtext: "",
    price: {
      value: 1500,
      currency: "TORI",
    },
  },
  {
    text: "Additional revision",
    subtext:
      "Add an additional revision your seller will provide after the delivery.",
    price: {
      value: 500,
      currency: "TORI",
    },
  },
  {
    text: "Include social media kit",
    subtext:
      "You'll get graphics showing your logo that you can use on social media platforms. Ex. Facebook and Instagram.",
    price: {
      value: 500,
      currency: "TORI",
    },
  },
  {
    text: "Stationery designs",
    subtext:
      "You'll get a template with your logo to use for stationary—letterhead, envelopes, business cards, etc.",
    price: {
      value: 500,
      currency: "TORI",
    },
  },
  {
    text: "Additional logo",
    subtext: "Add another (1) logo concept.",
    price: {
      value: 500,
      currency: "TORI",
    },
  },
  {
    text: "Full Vector Package",
    subtext:
      "I will provide full HQ resolution logo files in 5000 X 5000 Vector AI EPS PDF JPG PNG on transparent BG",
    price: {
      value: 500,
      currency: "TORI",
    },
  },
  {
    text: "Favicon Design",
    subtext: "I will design favicon for your Website",
    price: {
      value: 500,
      currency: "TORI",
    },
  },
  {
    text: "E Mail Signature",
    subtext: "I will design E-Mail signature for digital branding",
    price: {
      value: 500,
      currency: "TORI",
    },
  },
  {
    text: "Full Color Codes",
    subtext:
      "I will provide color codes in HEX RGB and CMYK for the final logo",
    price: {
      value: 500,
      currency: "TORI",
    },
  },
  {
    text: "Branding Design",
    subtext:
      "I will design double sided business card and letterhead design to build your brand",
    price: {
      value: 500,
      currency: "TORI",
    },
  },
  {
    text: "Logo Guidelines",
    subtext: "I will design an outstanding Logo Guidelines",
    price: {
      value: 500,
      currency: "TORI",
    },
  },
];

function SelectedExtra(props: { item: any }) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        width: 220,
        marginBottom: layout.padding_x1,
      }}
    >
      <SVG
        source={checkIcon}
        width={16}
        height={16}
        style={{ marginRight: 12 }}
      />
      <BrandText
        style={[fontSemibold14, { color: neutral77, marginRight: 24 }]}
      >
        {props.item.text}
      </BrandText>
    </View>
  );
}

export const FirstStep: React.FC = () => {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  return (
    <View style={{ width: 840 }}>
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
            <TopRatedSeller rating={4.9} />
            <View
              style={{
                width: 24,
                borderColor: neutral33,
                borderWidth: 0.5,
                transform: [{ rotate: "90deg" }],
              }}
            />
            <StarRating rating={4.9} />
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
        <FlatList
          data={title.filter((element, index) => {
            return selected.has(index);
          })}
          numColumns={4}
          renderItem={({ item }) => <SelectedExtra item={item} />}
          keyExtractor={(item) => item.text}
        />
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
      {title.map((item, index: number) => (
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
                color={selected.has(index) ? primaryColor : neutral00}
                value={selected.has(index)}
                onValueChange={(value) => {
                  if (value) {
                    selected.add(index);
                  } else {
                    selected.delete(index);
                  }
                  setSelected(new Set([...selected]));
                }}
              />
              <BrandText
                style={[fontSemibold16, { height: 24, lineHeight: 24 }]}
              >
                {item.text}
              </BrandText>
            </View>
            <BrandText style={[fontSemibold16]}>
              {item.price.value} {item.price.currency}
            </BrandText>
          </View>
          <BrandText
            style={[
              fontSemibold14,
              { color: neutral77, marginTop: 6, marginLeft: 48 },
            ]}
          >
            {item.subtext}
          </BrandText>
        </View>
      ))}
    </View>
  );
};
