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

import statisticBanner from "../../../../assets/Banner/statisticBanner.png";
import tournamentLogo from "../../../../assets/LogoPathwarOverview/tournamentLogo.png"
import { BrandText } from "../../../components/BrandText";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { BiSearch } from 'react-icons/bi';

import avatar from "./avatar.png"
import ava from "./ava.png"

// import { TournamentBox } from "./TournamentBox"

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


export const StatisticScreen: React.FC = () => {

  return (
    <ScreenContainer sizeScreenContaier={40}>
		<View>
			<ImageBackground source={statisticBanner} style={{ height: 400,
			width: "100%",
			justifyContent: 'center',
			alignItems: 'center',}}>
			</ImageBackground>
		</View>

        <TertiaryBox width={1338} height={44} style={{marginTop: 20}} center={true}>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignContent: "center", width: "97%"}}>
                <BrandText style={{fontSize: 12, color: "#777777"}}>
                #
                </BrandText>
                <BrandText style={{fontSize: 12, color: "#777777", right: 165, position: "relative"}}>
                Member
                </BrandText>
                <BrandText style={{fontSize: 12, color: "#777777", right: 100, position: "relative"}}>
                Team(s)
                </BrandText>
                <BrandText style={{fontSize: 12, color: "#777777"}}>
                Last Tournaments
                </BrandText>
                <BrandText style={{fontSize: 12, color: "#777777"}}>
                Score
                </BrandText>
                <BrandText style={{fontSize: 12, color: "#777777", right: 80, position: "relative"}}>
                Cash
                </BrandText>
            </View>
        </TertiaryBox>

        <View style={{width: "100%", height: 80}}>

            <View style={{width: "97%"}}>
                <View style={{flexDirection: "row", alignItems: "center", width: "97%", marginTop: 20, left: 23}}>
                    <BrandText style={{fontSize: 14}}>
                    1
                    </BrandText>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", width: "fit-content", marginLeft: 43}}>
                        <img src={avatar} width={27} height={27}></img>
                        <BrandText style={{fontSize: 14, marginLeft: 10}}>
                        @foofight3r.tori
                        </BrandText>
                    </View>

                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", marginLeft: 172}}>
                        <img src={ava} width={27} height={27}></img>
                        <BrandText style={{fontSize: 14, marginLeft: 10}}>
                        Team 1
                        </BrandText>
                    </View>

                    <BrandText style={{fontSize: 14, marginLeft: 270}}>
                    Tournament Name
                    </BrandText>

                    <BrandText style={{fontSize: 14, marginLeft: 200}}>
                    99
                    </BrandText>

                    <BrandText style={{fontSize: 14, marginLeft: 140}}>
                    5000 Tori
                    </BrandText>
                </View>

                <Separator style={{marginTop: 23}}/>
            </View>

            <View style={{width: "97%"}}>
                <View style={{flexDirection: "row", alignItems: "center", width: "97%", marginTop: 20, left: 23}}>
                    <BrandText style={{fontSize: 14}}>
                    1
                    </BrandText>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", width: "fit-content", marginLeft: 43}}>
                        <img src={avatar} width={27} height={27}></img>
                        <BrandText style={{fontSize: 14, marginLeft: 10}}>
                        @foofight3r.tori
                        </BrandText>
                    </View>

                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", marginLeft: 172}}>
                        <img src={ava} width={27} height={27}></img>
                        <BrandText style={{fontSize: 14, marginLeft: 10}}>
                        Team 1
                        </BrandText>
                    </View>

                    <BrandText style={{fontSize: 14, marginLeft: 270}}>
                    Tournament Name
                    </BrandText>

                    <BrandText style={{fontSize: 14, marginLeft: 200}}>
                    99
                    </BrandText>

                    <BrandText style={{fontSize: 14, marginLeft: 140}}>
                    5000 Tori
                    </BrandText>
                </View>

                <Separator style={{marginTop: 23}}/>
            </View>

            <View style={{width: "97%"}}>
                <View style={{flexDirection: "row", alignItems: "center", width: "97%", marginTop: 20, left: 23}}>
                    <BrandText style={{fontSize: 14}}>
                    1
                    </BrandText>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", width: "fit-content", marginLeft: 43}}>
                        <img src={avatar} width={27} height={27}></img>
                        <BrandText style={{fontSize: 14, marginLeft: 10}}>
                        @foofight3r.tori
                        </BrandText>
                    </View>

                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", marginLeft: 172}}>
                        <img src={ava} width={27} height={27}></img>
                        <BrandText style={{fontSize: 14, marginLeft: 10}}>
                        Team 1
                        </BrandText>
                    </View>

                    <BrandText style={{fontSize: 14, marginLeft: 270}}>
                    Tournament Name
                    </BrandText>

                    <BrandText style={{fontSize: 14, marginLeft: 200}}>
                    99
                    </BrandText>

                    <BrandText style={{fontSize: 14, marginLeft: 140}}>
                    5000 Tori
                    </BrandText>
                </View>

                <Separator style={{marginTop: 23}}/>
            </View>

            <View style={{width: "97%"}}>
                <View style={{flexDirection: "row", alignItems: "center", width: "97%", marginTop: 20, left: 23}}>
                    <BrandText style={{fontSize: 14}}>
                    1
                    </BrandText>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", width: "fit-content", marginLeft: 43}}>
                        <img src={avatar} width={27} height={27}></img>
                        <BrandText style={{fontSize: 14, marginLeft: 10}}>
                        @foofight3r.tori
                        </BrandText>
                    </View>

                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", marginLeft: 172}}>
                        <img src={ava} width={27} height={27}></img>
                        <BrandText style={{fontSize: 14, marginLeft: 10}}>
                        Team 1
                        </BrandText>
                    </View>

                    <BrandText style={{fontSize: 14, marginLeft: 270}}>
                    Tournament Name
                    </BrandText>

                    <BrandText style={{fontSize: 14, marginLeft: 200}}>
                    99
                    </BrandText>

                    <BrandText style={{fontSize: 14, marginLeft: 140}}>
                    5000 Tori
                    </BrandText>
                </View>

                <Separator style={{marginTop: 23}}/>
            </View>

        
        </View>
    </ScreenContainer>
  );
};