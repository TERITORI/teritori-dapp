import React from "react";
import {
    useWindowDimensions,
    View,
    StyleProp,
    ViewStyle,
  } from "react-native";

import { ScreenContainer } from "../../components/ScreenContainer";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { ScreenFC } from "../../utils/navigation";
import { neutral44 } from "../../utils/style/colors";
import { useAppNavigation } from "../../utils/navigation";

import pathwarBanner from "../../../assets/Banner/pathwarBanner.png";
import { BrandText } from "../../components/BrandText";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import { BiSearch } from 'react-icons/bi';

import { ChallengeBox } from "../../components/Pathwar/ChallengeBox";

import { ConnectBar } from "../../components/Pathwar/ConnectBar";
import { NavBarPathwarOverview } from "../../components/Pathwar/NavBarPathwarOverview";

const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
    <View
      style={[
        { borderBottomWidth: 1, borderColor: neutral44, width: "100%" },
        style,
      ]}
    />
  );

import data from "./data.json"

export const PathwarScreen: ScreenFC<"Pathwar"> = () => {
    const { width, height } = useWindowDimensions();
    console.log(width, height);
    const navigation = useAppNavigation();

  return (
    <ScreenContainer sizeScreenContaier={40} >
        <View>
            <img src={pathwarBanner} alt="PathwarHeader" style={{width: "100%"}}/>
        </View>
        <View style={{marginTop: 20}}>
            <ConnectBar/>
        </View>
        <NavBarPathwarOverview/>

        <Separator style={{marginTop: 20, marginBottom: 30}}/>

        <View style={{flexDirection: "column", display: "flex", alignItems: "center", width: "100%", marginBottom: 40}}>
            <BrandText style={{fontSize: 28}}>
                Challenges
            </BrandText>
            <View style={{marginTop: 30}}>
                <TextInputCustom 
                    label=""
                    name={"Search"}
                    width={400}
                    placeHolder="Search..."
                    mainBoxBackgroundColor="#000000"
                    >
                    <View  style={{right: 5}}>
                        <BiSearch color="white"/>
                    </View>
                </TextInputCustom>
            </View>
        </View>

        <View style={{display: "flex", width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between"}}>
                {data.items.map((item, index) => (
                    <ChallengeBox 
                        title={item.flavor.slug}
                        description={item.flavor.body}
                        tags={item.flavor.tags}/>
                ))}
        </View>
    </ScreenContainer>
  );
};