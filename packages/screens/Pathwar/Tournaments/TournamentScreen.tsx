import React from "react";
import { BiSearch } from "react-icons/bi";
import { View } from "react-native";

import tounamentBanner from "../../../../assets/Banner/tournamentsBanner.svg";
import tournamentLogo from "../../../../assets/LogoPathwarOverview/tournamentLogo.svg";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { TournamentBox } from "./TournamentBox";

export const TournamentScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <View>
        <SVG
          source={tounamentBanner}
          style={{
            height: 400,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SVG source={tournamentLogo} />
          <View style={{ marginTop: 30 }} />
        </SVG>
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          alignContent: "center",
          marginTop: 20,
        }}
      >
        <View>
          <TextInputCustom<{ Search: string }>
            label=""
            name="Search"
            width={270}
            placeHolder="Search..."
            mainBoxBackgroundColor="#000000"
          >
            <View style={{ right: 5 }}>
              <BiSearch color="white" />
            </View>
          </TextInputCustom>
        </View>
      </View>

      <View
        style={{
          display: "flex",
          width: "119%",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          right: 90,
          marginTop: 20,
        }}
      >
        <TournamentBox />
        <TournamentBox />
      </View>
    </ScreenContainer>
  );
};
