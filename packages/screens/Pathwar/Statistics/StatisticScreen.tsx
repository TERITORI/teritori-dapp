import React from "react";
import { View, Image } from "react-native";

import ava from "./ava.png";
import avatar from "./avatar.png";
import statisticBanner from "../../../../assets/banners/statisticBanner.png";
import { PathwarLeaderboardItem } from "../../../api/pathwar/v1/pathwar";
import { BrandText } from "../../../components/BrandText";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { Separator } from "../../../components/Separator";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { prettyPrice } from "../../../utils/coins";
import { useAppNavigation } from "../../../utils/navigation";
import { neutral44, neutral77 } from "../../../utils/style/colors";
import {
  fontSemibold14,
  fontSemibold12,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const StatisticScreen: React.FC = () => {
  const navigation = useAppNavigation();

  const data = [
    {
      rank: 1,
      address: "tori123",
      team: "Argentum",
      lastTournament: "Tournament Placeholder",
      score: 123,
      balance: {
        amount: "123",
        denom: "utori",
      },
    },
    {
      rank: 2,
      address: "tori123",
      team: "Argentum",
      lastTournament: "Tournament Placeholder",
      score: 123,
      balance: {
        amount: "123",
        denom: "utori",
      },
    },
  ] as PathwarLeaderboardItem[];
  return (
    <ScreenContainer
      responsive
      isLarge
      footerChildren={<></>}
      headerChildren={<BrandText style={fontSemibold20}>Statistics</BrandText>}
      onBackPress={() => navigation.navigate("Pathwar")}
    >
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
          {data.map((item) => (
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
                <BrandText style={fontSemibold14}>{item.rank}</BrandText>
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
                  {item.address}
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
                  {item.team}
                </BrandText>
              </View>

              <BrandText
                style={[
                  { width: 263, paddingLeft: layout.padding_x3 },
                  fontSemibold14,
                ]}
              >
                {item.lastTournament}
              </BrandText>

              <BrandText
                style={[
                  { width: 113, paddingLeft: layout.padding_x3_5 },
                  fontSemibold14,
                ]}
              >
                {item.score}
              </BrandText>

              <BrandText
                style={[
                  { width: 100, paddingLeft: layout.padding_x3_5 },
                  fontSemibold14,
                ]}
              >
                {item.balance &&
                  prettyPrice(
                    "teritori",
                    item.balance?.amount,
                    item.balance?.denom
                  )}
              </BrandText>
            </View>
          ))}

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
