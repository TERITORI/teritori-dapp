import React from "react";
import { View, Image } from "react-native";

import tounamentBanner from "../../../../assets/banners/tournamentBanner.png";
import searchIcon from "../../../../assets/icons/Pathwar/searchIcon.svg";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { neutral00 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { TournamentBox } from "./TournamentCard";

export const TournamentScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          margin: "auto",
        }}
      >
        <Image
          source={tounamentBanner}
          style={{
            width: "100%",
            height: 400,
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          alignContent: "center",
          marginTop: layout.padding_x2_5,
        }}
      >
        <View>
          <TextInputCustom<{ Search: string }>
            label=""
            name="Search"
            width={270}
            placeHolder="Search..."
            mainBoxBackgroundColor={neutral00}
          >
            <View style={{ marginRight: layout.padding_x0_5 }}>
              <SVG source={searchIcon} />
            </View>
          </TextInputCustom>
        </View>
      </View>

      <View
        style={{
          width: 1320,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignSelf: "center",
          marginTop: layout.padding_x2_5,
        }}
      >
        <TournamentBox />
        <TournamentBox />
      </View>
    </ScreenContainer>
  );
};
