import React from "react";
import { ImageBackground, View } from "react-native";

import tournamentLogo from "../../../../assets/LogoPathwarOverview/tournamentLogo.svg";
import tounamentBanner from "../../../../assets/banners/tournamentsBanner.png";
import searchIcon from "../../../../assets/icons/Pathwar/searchIcon.svg";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { TournamentBox } from "./TournamentBox";

export const TournamentScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <View>
        <ImageBackground
          source={tounamentBanner}
          style={{
            height: 400,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SVG source={tournamentLogo} />
        </ImageBackground>
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
              <SVG source={searchIcon} />
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
