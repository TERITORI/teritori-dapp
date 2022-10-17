import React, { useState } from "react";
import {
    useWindowDimensions,
    View,
    StyleProp,
    ViewStyle,
    ImageBackground,
	TouchableOpacity
  } from "react-native";

import { ScreenContainer } from "../../../components/ScreenContainer";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { ScreenFC } from "../../../utils/navigation";
import { neutral44 } from "../../../utils/style/colors";

import tounamentBanner from "../../../../assets/Banner/tournamentsBanner.png";
import tournamentLogo from "../../../../assets/LogoPathwarOverview/tournamentLogo.png"
import { BrandText } from "../../../components/BrandText";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { BiSearch } from 'react-icons/bi';

import { TournamentBox } from "./TournamentBox"

// import Checkbox from "react-custom-checkbox";
// import { ResourceBox } from "./ResourceBox"

const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
    <View
      style={[
        { borderBottomWidth: 1, borderColor: neutral44, width: "100%" },
        style,
      ]}
    />
  );

const data = ["Challenge 1", "Challenge 2", "Challenge 3", "Challenge 4", "Challenge 5"]


export const TournamentScreen: React.FC = () => {

  return (
    <ScreenContainer sizeScreenContaier={40}>
		<View>
			<ImageBackground source={tounamentBanner} style={{ height: 400,
			width: "100%",
			justifyContent: 'center',
			alignItems: 'center',}}>

			<img src={tournamentLogo} alt="ResourceLogo" style={{width: "12%"}}/>
			<View style={{marginTop: 30}}>
			</View>
			</ImageBackground>
		</View>

		<View style={{flexDirection: "row", width: "100%", justifyContent: "center", alignContent: "center", marginTop: 20}}>
			<View>
				<TextInputCustom 
					label=""
					name={"Search"}
					width={270}
					placeHolder="Search..."
					mainBoxBackgroundColor="#000000"
					>
					<View  style={{right: 5}}>
						<BiSearch color="white"/>
					</View>
				</TextInputCustom>
			</View>
        </View>

		<View style={{display: "flex", width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 20}}>
			<TournamentBox/>
			<TournamentBox/>
		</View>
    </ScreenContainer>
  );
};