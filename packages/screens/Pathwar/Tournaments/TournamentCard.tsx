import React from "react";
import { View } from "react-native";

import checkIcon from "../../../../assets/icons/Pathwar/checkIcon.svg";
import clockIcon from "../../../../assets/icons/Pathwar/clockIcon.svg";
import { Tournament } from "../../../api/pathwar/v1/pathwar";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import {
  hardColor,
  neutral17,
  neutral44,
  neutral77,
  secondaryColor,
  successColor,
} from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold16,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { Badge } from "../components/Badge";
import { LeftRail } from "../components/LeftRail";
import { PathWarRewards } from "../components/PathWarRewards";

export const TournamentBox: React.FC<{ data: Tournament }> = ({ data }) => {
  return (
    <TertiaryBox
      mainContainerStyle={{ backgroundColor: neutral17 }}
      style={{
        marginBottom: layout.padding_x2_5,
        marginLeft: layout.padding_x1,
        marginRight: layout.padding_x1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          marginTop: layout.padding_x2,
          marginBottom: layout.padding_x2,
          marginLeft: layout.padding_x2,
          marginRight: layout.padding_x2,
          alignItems: "center",
        }}
      >
        <LeftRail
          sourceURI={data.thumbnail}
          price={data.price}
          // onPress={() => setDisplayChallengeDetails(true)}
        />

        <View
          style={{
            height: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: layout.padding_x1_5,
              width: 260,
            }}
          >
            <View style={{ flexDirection: "column", width: "100%" }}>
              <BrandText style={[{ color: secondaryColor }, fontSemibold16]}>
                {data.title}
              </BrandText>
              <BrandText
                style={[
                  { color: neutral77, marginTop: layout.padding_x0_5 },
                  fontSemibold13,
                ]}
              >
                {data.tagline}
              </BrandText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Badge
                color={
                  data.difficulty.toLowerCase().includes("hard")
                    ? hardColor
                    : successColor
                }
                backgroundColor="#FF5C001A"
                label={data.difficulty}
              />
              <Badge
                color={secondaryColor}
                label={data.status}
                backgroundColor={neutral77}
              />
            </View>
          </View>

          <Separator
            style={{
              marginBottom: layout.padding_x2,
              width: 390,
            }}
            color={neutral44}
          />

          <View
            style={{
              width: 390,
              flexDirection: "row",
              marginBottom: layout.padding_x1_5,
              flexWrap: "wrap",
            }}
          >
            <BrandText style={[{ color: neutral77 }, fontSemibold13]}>
              {data.description}
            </BrandText>
          </View>

          <Separator
            style={{
              marginBottom: layout.padding_x2,
              width: 390,
            }}
            color={neutral44}
          />

          <BrandText
            style={[
              { color: neutral77, marginBottom: layout.padding_x0_5 },
              fontSemibold13,
            ]}
          >
            Details about this tournament:
          </BrandText>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: layout.padding_x0_5,
                }}
              >
                <SVG source={checkIcon} />
                <BrandText
                  style={[
                    { color: secondaryColor, marginLeft: layout.padding_x1_5 },
                    fontSemibold12,
                  ]}
                >
                  {`${data.numUsersJoined} pirates joined it`}
                </BrandText>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginBottom: layout.padding_x0_5,
              }}
            >
              <SVG source={clockIcon} />
              <BrandText
                style={[
                  { color: secondaryColor, marginLeft: layout.padding_x1_5 },
                  fontSemibold12,
                ]}
              >
                Duration: {data.duration}
              </BrandText>
            </View>
          </View>

          <PathWarRewards rewards={data.rewards} />
        </View>
      </View>
    </TertiaryBox>
  );
};
