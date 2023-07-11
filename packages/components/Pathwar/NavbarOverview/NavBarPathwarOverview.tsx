import React from "react";
import { Linking, Pressable, TouchableOpacity, View } from "react-native";

import { NavbarCard } from "./NavbarCard";
import BookIcon from "../../../../assets/LogoPathwarOverview/BookIcon.svg";
import CodeIcon from "../../../../assets/LogoPathwarOverview/CodeIcon.svg";
import GoToPageIcon from "../../../../assets/LogoPathwarOverview/GoToPageIcon.svg";
import PlaneteIcon from "../../../../assets/LogoPathwarOverview/PlaneteIcon.svg";
import StatsIcon from "../../../../assets/LogoPathwarOverview/StatsIcon.svg";
import TournamentIcon from "../../../../assets/LogoPathwarOverview/TournamentIcon.svg";
import { useAppNavigation } from "../../../utils/navigation";
import {
  neutral00,
  neutral17,
  neutral33,
  primaryColor,
} from "../../../utils/style/colors";
import {
  fontMedium10,
  fontSemibold14,
  fontSemibold20,
  fontSemibold28,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryBox } from "../../boxes/TertiaryBox";

export const NavBarPathwarOverview: React.FC<object> = () => {
  const navigation = useAppNavigation();
  return (
    <>
      <BrandText
        style={[
          { marginTop: layout.padding_x2_5, marginBottom: layout.padding_x2_5 },
          fontSemibold28,
        ]}
      >
        Pathwar Overview
      </BrandText>

      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "space-between",
        }}
      >
        <NavbarCard
          width={200}
          height={150}
          onPress={() => navigation.navigate("Statistics")}
        >
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-around",
              width: "100%",
              paddingBottom: layout.padding_x0_5,
            }}
          >
            <View style={{ marginLeft: layout.padding_x0_5 }}>
              <SVG source={StatsIcon} />
            </View>
            <TertiaryBox
              mainContainerStyle={{
                backgroundColor: neutral00,
                padding: layout.padding_x1,
              }}
              squaresBackgroundColor={neutral17}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignContent: "flex-start",
                  alignItems: "flex-start",
                  marginLeft: layout.padding_x0_5,
                  marginRight: layout.padding_x0_5,
                }}
              >
                <BrandText style={fontMedium10}>Top 1: rzearaz</BrandText>
                <BrandText style={fontMedium10}>Top 2: Pokemon</BrandText>
                <BrandText style={fontMedium10}>Top 3: Louia</BrandText>
                <BrandText style={fontMedium10}>Top 4: Lkolpop</BrandText>
              </View>
            </TertiaryBox>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-around",
              width: "100%",
              paddingTop: layout.padding_x1,
              alignItems: "center",
            }}
          >
            <BrandText style={fontSemibold14}>Statistics</BrandText>
            <TouchableOpacity onPress={() => navigation.navigate("Statistics")}>
              <SVG source={GoToPageIcon} />
            </TouchableOpacity>
          </View>
        </NavbarCard>

        <NavbarCard
          width={200}
          height={150}
          onPress={() => navigation.navigate("Resources")}
        >
          <View style={{ marginLeft: layout.padding_x2_5 }}>
            <SVG source={BookIcon} />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-around",
              width: "100%",
              paddingTop: layout.padding_x4,
              alignItems: "center",
            }}
          >
            <BrandText style={fontSemibold14}>Resources</BrandText>
            <TouchableOpacity onPress={() => navigation.navigate("Resources")}>
              <SVG source={GoToPageIcon} />
            </TouchableOpacity>
          </View>
        </NavbarCard>

        <NavbarCard
          width={200}
          height={150}
          onPress={() => Linking.openURL("https://gno.land/")}
        >
          <View style={{ marginLeft: layout.padding_x2_5 }}>
            <SVG source={PlaneteIcon} />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-around",
              width: "100%",
              paddingTop: layout.padding_x4,
              alignItems: "center",
            }}
          >
            <BrandText style={fontSemibold14}>Gno.land</BrandText>
            <TouchableOpacity>
              <SVG source={GoToPageIcon} />
            </TouchableOpacity>
          </View>
        </NavbarCard>

        <NavbarCard
          width={200}
          height={150}
          onPress={() =>
            Linking.openURL(
              "https://tutorials.cosmos.network/academy/0-welcome/"
            )
          }
        >
          <View style={{ marginLeft: layout.padding_x2_5 }}>
            <SVG source={CodeIcon} />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-around",
              width: "100%",
              paddingTop: layout.padding_x4,
              alignItems: "center",
            }}
          >
            <BrandText style={fontSemibold14}>Cosmos Academy</BrandText>
            <TouchableOpacity>
              <SVG source={GoToPageIcon} />
            </TouchableOpacity>
          </View>
        </NavbarCard>

        <NavbarCard
          width={200}
          height={150}
          onPress={() => navigation.navigate("Tournaments")}
        >
          <View style={{ marginLeft: layout.padding_x2_5 }}>
            <SVG source={TournamentIcon} />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-around",
              width: "100%",
              paddingTop: layout.padding_x4,
              alignItems: "center",
            }}
          >
            <BrandText
              style={[{ marginLeft: layout.padding_x0_5 }, fontSemibold14]}
            >
              Tournaments
            </BrandText>
            <View
              style={{
                width: "fit-content",
                height: "fit-content",
                borderRadius: 32,
                borderWidth: 0.5,
                borderColor: neutral33,
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                marginLeft: layout.padding_x1,
              }}
            >
              <BrandText
                style={[
                  {
                    color: primaryColor,
                    paddingTop: layout.padding_x0_25,
                    paddingBottom: layout.padding_x0_25,
                    paddingLeft: layout.padding_x1,
                    paddingRight: layout.padding_x1,
                  },
                  fontSemibold20,
                ]}
              >
                3
              </BrandText>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Tournaments")}
            >
              <SVG source={GoToPageIcon} />
            </TouchableOpacity>
          </View>
        </NavbarCard>
      </View>
    </>
  );
};
