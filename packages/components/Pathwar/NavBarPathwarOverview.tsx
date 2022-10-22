import React from "react";
import { View, TouchableOpacity } from "react-native";

import BookIcon from "../../../assets/LogoPathwarOverview/BookIcon.svg";
import CodeIcon from "../../../assets/LogoPathwarOverview/CodeIcon.svg";
import GoToPageIcon from "../../../assets/LogoPathwarOverview/GoToPageIcon.svg";
import PlaneteIcon from "../../../assets/LogoPathwarOverview/PlaneteIcon.svg";
import StatsIcon from "../../../assets/LogoPathwarOverview/StatsIcon.svg";
import TournamentIcon from "../../../assets/LogoPathwarOverview/TournamentIcon.svg";
import { useAppNavigation } from "../../utils/navigation";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const NavBarPathwarOverview: React.FC<object> = () => {
  const navigation = useAppNavigation();
  return (
    <>
      <BrandText style={{ fontSize: 28, marginTop: 20, marginBottom: 20 }}>
        Pathwar Overview
      </BrandText>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "space-between",
        }}
      >
        <TertiaryBox
          width={200}
          height={150}
          mainContainerStyle={{ backgroundColor: "#171717" }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
              width: "92%",
              bottom: "11%",
            }}
          >
            <View style={{ marginTop: 8, marginLeft: 5 }}>
              <SVG source={StatsIcon} />
            </View>
            <TertiaryBox
              width={120}
              height={70}
              differentSquaresColor
              mainContainerStyle={{ backgroundColor: "#000000" }}
              leftSquaresBackgroundColor="#171717"
              rightSquaresBackgroundColor="#171717"
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "flex-start",
                  alignItems: "flex-start",
                  width: "86%",
                }}
              >
                <BrandText style={{ fontSize: 10 }}>Top 1</BrandText>
                <BrandText style={{ fontSize: 10 }}>Top 2</BrandText>
                <BrandText style={{ fontSize: 10 }}>Top 3</BrandText>
                <BrandText style={{ fontSize: 10 }}>Top 4</BrandText>
              </View>
            </TertiaryBox>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
              width: "85%",
              top: 10,
              alignItems: "center",
            }}
          >
            <BrandText style={{ fontSize: 15 }}>Statistics</BrandText>
            <TouchableOpacity onPress={() => navigation.navigate("Statistics")}>
              <SVG source={GoToPageIcon} />
            </TouchableOpacity>
          </View>
        </TertiaryBox>

        <TertiaryBox
          width={200}
          height={150}
          mainContainerStyle={{ backgroundColor: "#171717" }}
        >
          <View style={{ bottom: 26, right: 70 }}>
            <SVG source={BookIcon} />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
              width: "85%",
              top: 25,
              alignItems: "center",
            }}
          >
            <BrandText style={{ fontSize: 15 }}>Ressources</BrandText>
            <TouchableOpacity onPress={() => navigation.navigate("Resources")}>
              <SVG source={GoToPageIcon} />
            </TouchableOpacity>
          </View>
        </TertiaryBox>

        <TertiaryBox
          width={200}
          height={150}
          mainContainerStyle={{ backgroundColor: "#171717" }}
        >
          <View style={{ bottom: 26, right: 70 }}>
            <SVG source={PlaneteIcon} />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
              width: "85%",
              top: 25,
              alignItems: "center",
            }}
          >
            <BrandText style={{ fontSize: 15 }}>Gno.land</BrandText>
            <TouchableOpacity>
              <SVG source={GoToPageIcon} />
            </TouchableOpacity>
          </View>
        </TertiaryBox>

        <TertiaryBox
          width={200}
          height={150}
          mainContainerStyle={{ backgroundColor: "#171717" }}
        >
          <View style={{ bottom: 26, right: 70 }}>
            <SVG source={CodeIcon} />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
              width: "85%",
              top: 25,
              alignItems: "center",
            }}
          >
            <BrandText style={{ fontSize: 15 }}>Cosmos Academy</BrandText>
            <TouchableOpacity>
              <SVG source={GoToPageIcon} />
            </TouchableOpacity>
          </View>
        </TertiaryBox>

        <TertiaryBox
          width={200}
          height={150}
          mainContainerStyle={{ backgroundColor: "#171717" }}
        >
          <View style={{ bottom: 26, right: 70 }}>
            <SVG source={TournamentIcon} />
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
              width: "90%",
              top: 25,
              alignItems: "center",
            }}
          >
            <BrandText style={{ fontSize: 15 }}>Tournaments</BrandText>
            <View
              style={{
                width: "fit-content",
                height: "fit-content",
                borderRadius: 32,
                borderWidth: 0.5,
                borderColor: "#333333",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                marginLeft: 10,
              }}
            >
              <BrandText
                style={{
                  fontSize: 20,
                  color: "#16BBFF",
                  paddingTop: 2,
                  paddingBottom: 2,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
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
        </TertiaryBox>
      </View>
    </>
  );
};
