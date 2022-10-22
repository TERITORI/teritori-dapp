import React from "react";
import { View, Image } from "react-native";

import statisticBanner from "../../../../assets/banners/statisticBanner.png";
import { BrandText } from "../../../components/BrandText";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { Separator } from "../../../components/Separator";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { neutral44, neutral77 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import ava from "./ava.png";
import avatar from "./avatar.png";

export const StatisticScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <Image
        source={statisticBanner}
        style={{
          width: "100%",
          height: 400,
        }}
      />

      <TertiaryBox
        fullWidth
        height={44}
        style={{
          marginTop: layout.padding_x2_5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: layout.padding_x2_5,
            }}
          >
            <View
              style={{
                width: 40,
                maxWidth: 40,
              }}
            >
              <BrandText style={[{ color: neutral77 }, fontSemibold12]}>
                #
              </BrandText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: 230,
                paddingLeft: layout.padding_x0_5,
              }}
            >
              <BrandText
                style={[
                  { marginLeft: layout.padding_x1, color: neutral77 },
                  fontSemibold12,
                ]}
              >
                Member
              </BrandText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: 303,
                marginLeft: layout.padding_x1,
              }}
            >
              <BrandText
                style={[
                  {
                    width: 280,
                    marginLeft: layout.padding_x1,
                    color: neutral77,
                  },
                  fontSemibold12,
                ]}
              >
                Team(s)
              </BrandText>
            </View>

            <BrandText
              style={[
                {
                  width: 263,
                  paddingLeft: layout.padding_x3,
                  color: neutral77,
                },
                fontSemibold12,
              ]}
            >
              Last Tournament(s)
            </BrandText>

            <BrandText
              style={[
                {
                  width: 113,
                  paddingLeft: layout.padding_x3_5,
                  color: neutral77,
                },
                fontSemibold12,
              ]}
            >
              Score
            </BrandText>

            <BrandText
              style={[
                {
                  width: 100,
                  paddingLeft: layout.padding_x3_5,
                  color: neutral77,
                },
                fontSemibold12,
              ]}
            >
              Cash
            </BrandText>
          </View>
        </View>
      </TertiaryBox>

      <View style={{ width: "100%", height: 80 }}>
        <View style={{ width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: layout.padding_x2_5,
              paddingLeft: layout.padding_x2_5,
            }}
          >
            <View
              style={{
                width: 40,
                maxWidth: 40,
              }}
            >
              <BrandText style={fontSemibold14}>1</BrandText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: 230,
                paddingLeft: layout.padding_x0_5,
              }}
            >
              <Image source={avatar} style={{ width: 27, height: 27 }} />
              <BrandText
                style={[
                  { marginLeft: layout.padding_x1, width: 190 },
                  fontSemibold14,
                ]}
              >
                @foofight3r.tori
              </BrandText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: 303,
                marginLeft: layout.padding_x1,
              }}
            >
              <Image source={ava} style={{ width: 27, height: 27 }} />
              <BrandText
                style={[
                  { width: 280, marginLeft: layout.padding_x1 },
                  fontSemibold14,
                ]}
              >
                Team Troll
              </BrandText>
            </View>

            <BrandText
              style={[
                { width: 263, paddingLeft: layout.padding_x3 },
                fontSemibold14,
              ]}
            >
              Tournament Name
            </BrandText>

            <BrandText
              style={[
                { width: 113, paddingLeft: layout.padding_x3_5 },
                fontSemibold14,
              ]}
            >
              99
            </BrandText>

            <BrandText
              style={[
                { width: 100, paddingLeft: layout.padding_x3_5 },
                fontSemibold14,
              ]}
            >
              5000 Tori
            </BrandText>
          </View>

          <Separator
            style={{
              borderBottomWidth: 1,
              borderColor: neutral44,
              width: "100%",
              marginTop: layout.padding_x2_5,
            }}
            color={neutral44}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
