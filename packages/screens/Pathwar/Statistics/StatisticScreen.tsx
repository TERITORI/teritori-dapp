import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";

import statisticBanner from "../../../../assets/banners/statisticBanner.png";
import { BrandText } from "../../../components/BrandText";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { neutral44 } from "../../../utils/style/colors";
import ava from "./ava.png";
import avatar from "./avatar.png";

const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
  <View
    style={[
      { borderBottomWidth: 1, borderColor: neutral44, width: "100%" },
      style,
    ]}
  />
);

export const StatisticScreen: React.FC = () => {
  return (
    <ScreenContainer sizeScreenContaier={40}>
      <View>
        <img
          src={statisticBanner}
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </View>

      <TertiaryBox
        width={1092}
        height={44}
        style={{ marginTop: 20, justifyContent: "center" }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            width: "97%",
          }}
        >
          <View>
            <BrandText style={{ fontSize: 12, color: "#777777" }}>#</BrandText>
          </View>
          <BrandText
            style={{
              fontSize: 12,
              color: "#777777",
              right: 130,
              position: "relative",
            }}
          >
            Member
          </BrandText>
          <BrandText
            style={{
              fontSize: 12,
              color: "#777777",
              right: 100,
              position: "relative",
            }}
          >
            Team(s)
          </BrandText>
          <BrandText style={{ fontSize: 12, color: "#777777" }}>
            Last Tournaments
          </BrandText>
          <BrandText style={{ fontSize: 12, color: "#777777" }}>
            Score
          </BrandText>
          <BrandText
            style={{
              fontSize: 12,
              color: "#777777",
              right: 80,
              position: "relative",
            }}
          >
            Cash
          </BrandText>
        </View>
      </TertiaryBox>

      <View style={{ width: "100%", height: 80 }}>
        <View style={{ width: "97%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "97%",
              marginTop: 20,
              left: 20,
            }}
          >
            <View
              style={{
                width: 35,
              }}
            >
              <BrandText style={{ fontSize: 14 }}>1</BrandText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: 230,
                overflow: "hidden",
              }}
            >
              <img src={avatar} width={27} height={27} />
              <BrandText style={{ fontSize: 14, marginLeft: 10 }}>
                @foofight3r.torie
              </BrandText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: 310,
              }}
            >
              <img src={ava} width={27} height={27} />
              <BrandText style={{ fontSize: 14, marginLeft: 10 }}>
                Team 1lkerznfjglzengoenrzog
              </BrandText>
            </View>

            <BrandText style={{ fontSize: 14, width: 266 }}>
              Tournament Name
            </BrandText>

            <BrandText style={{ fontSize: 14, width: 109 }}>99</BrandText>

            <BrandText style={{ fontSize: 14, width: "fit-content" }}>
              5000 Tori
            </BrandText>
          </View>

          <Separator style={{ marginTop: 23 }} />
        </View>

        <View style={{ width: "97%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "97%",
              marginTop: 20,
              left: 20,
            }}
          >
            <View
              style={{
                width: 35,
              }}
            >
              <BrandText style={{ fontSize: 14 }}>1</BrandText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: 230,
                overflow: "hidden",
              }}
            >
              <img src={avatar} width={27} height={27} />
              <BrandText style={{ fontSize: 14, marginLeft: 10 }}>
                @foofight3r.torie
              </BrandText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: 310,
              }}
            >
              <img src={ava} width={27} height={27} />
              <BrandText style={{ fontSize: 14, marginLeft: 10 }}>
                Team 1lkerznfjglzengoenrzog
              </BrandText>
            </View>

            <BrandText style={{ fontSize: 14, width: 266 }}>
              Tournament Name
            </BrandText>

            <BrandText style={{ fontSize: 14, width: 109 }}>99</BrandText>

            <BrandText style={{ fontSize: 14, width: "fit-content" }}>
              5000 Tori
            </BrandText>
          </View>

          <Separator style={{ marginTop: 23 }} />
        </View>

        <View style={{ width: "97%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "97%",
              marginTop: 20,
              left: 20,
            }}
          >
            <View
              style={{
                width: 35,
              }}
            >
              <BrandText style={{ fontSize: 14 }}>1</BrandText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: 230,
                overflow: "hidden",
              }}
            >
              <img src={avatar} width={27} height={27} />
              <BrandText style={{ fontSize: 14, marginLeft: 10 }}>
                @foofight3r.torie
              </BrandText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: 310,
              }}
            >
              <img src={ava} width={27} height={27} />
              <BrandText style={{ fontSize: 14, marginLeft: 10 }}>
                Team 1lkerznfjglzengoenrzog
              </BrandText>
            </View>

            <BrandText style={{ fontSize: 14, width: 266 }}>
              Tournament Name
            </BrandText>

            <BrandText style={{ fontSize: 14, width: 109 }}>99</BrandText>

            <BrandText style={{ fontSize: 14, width: "fit-content" }}>
              5000 Tori
            </BrandText>
          </View>

          <Separator style={{ marginTop: 23 }} />
        </View>

        <View style={{ width: "97%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "97%",
              marginTop: 20,
              left: 20,
            }}
          >
            <View
              style={{
                width: 35,
              }}
            >
              <BrandText style={{ fontSize: 14 }}>1</BrandText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: 230,
                overflow: "hidden",
              }}
            >
              <img src={avatar} width={27} height={27} />
              <BrandText style={{ fontSize: 14, marginLeft: 10 }}>
                @foofight3r.torie
              </BrandText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: 310,
              }}
            >
              <img src={ava} width={27} height={27} />
              <BrandText style={{ fontSize: 14, marginLeft: 10 }}>
                Team 1lkerznfjglzengoenrzog
              </BrandText>
            </View>

            <BrandText style={{ fontSize: 14, width: 266 }}>
              Tournament Name
            </BrandText>

            <BrandText style={{ fontSize: 14, width: 109 }}>99</BrandText>

            <BrandText style={{ fontSize: 14, width: "fit-content" }}>
              5000 Tori
            </BrandText>
          </View>

          <Separator style={{ marginTop: 23 }} />
        </View>
      </View>
    </ScreenContainer>
  );
};
