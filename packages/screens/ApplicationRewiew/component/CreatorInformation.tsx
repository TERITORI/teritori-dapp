import React from "react";
import { View, useWindowDimensions } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { neutral33, neutral77 } from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold14,
  fontSemibold20,
} from "../../../utils/style/fonts";

const MD_BREAKPOINT = 800;

export const CreatorInformation: React.FC = () => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        borderTopColor: neutral33,
        borderTopWidth: 1,
        paddingTop: 32,
      }}
    >
      <BrandText style={fontSemibold20}>Creator information</BrandText>
      <View
        style={{
          flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
          marginTop: 16,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <TertiaryBox
          style={{
            borderRadius: 6,
            padding: 12,
            flex: 1,
          }}
        >
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            Creator Name
          </BrandText>
          <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
            @nickname
          </BrandText>
        </TertiaryBox>
        <TertiaryBox
          style={{
            borderRadius: 6,
            padding: 12,
            flex: 1,
          }}
        >
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            Creator Name
          </BrandText>
          <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
            @nickname
          </BrandText>
        </TertiaryBox>
        <View style={{ flex: 1, flexDirection: "row", gap: 12 }}>
          <TertiaryBox
            style={{
              borderRadius: 6,
              padding: 12,
              flex: 1,
            }}
          >
            <BrandText style={[fontSemibold12, { color: neutral77 }]}>
              Twitter Follower Range
            </BrandText>
            <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
              5000
            </BrandText>
          </TertiaryBox>
          <TertiaryBox
            style={{
              borderRadius: 6,
              padding: 12,
              flex: 1,
            }}
          >
            <BrandText style={[fontSemibold12, { color: neutral77 }]}>
              Twitter Follower Count
            </BrandText>
            <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
              5000
            </BrandText>
          </TertiaryBox>
        </View>
      </View>
      <View
        style={{
          flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
          marginTop: 12,
          gap: 12,
        }}
      >
        <TertiaryBox
          style={{
            borderRadius: 6,
            padding: 12,
            flex: 1,
          }}
        >
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            Main Contact Discord
          </BrandText>
          <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
            @nickname
          </BrandText>
        </TertiaryBox>
        <TertiaryBox
          style={{
            borderRadius: 6,
            padding: 12,
            flex: 1,
          }}
        >
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            Discord URL
          </BrandText>
          <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
            https://discord.com/link
          </BrandText>
        </TertiaryBox>
        <TertiaryBox
          style={{
            borderRadius: 6,
            padding: 12,
            flex: 1,
          }}
        >
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            Main Contact Email
          </BrandText>
          <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
            hello@email.com
          </BrandText>
        </TertiaryBox>
      </View>
    </View>
  );
};
