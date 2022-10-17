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

import pathwarBanner from "../../../../assets/Banner/resourcesBanner.png";
import resourceLogo from "../../../../assets/LogoPathwarOverview/ResourceLogo.png"
import { BrandText } from "../../../components/BrandText";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { BiSearch } from 'react-icons/bi';
import { CgSortAz, CgOptions } from 'react-icons/Cg';
import { FiChevronDown } from 'react-icons/Fi';
import { FiChevronUp, FiCheck } from 'react-icons/Fi';
import { AiOutlineHeart } from 'react-icons/ai';

import Checkbox from "react-custom-checkbox";

import { DropdownButton } from "../../../components/buttons/DropdownButton";

import { ChallengeBox } from "../../../components/Pathwar/ChallengeBox";
import { ConnectBar } from "../../../components/Pathwar/ConnectBar";
import { NavBarPathwarOverview } from "../../../components/Pathwar/NavBarPathwarOverview";

const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
    <View
      style={[
        { borderBottomWidth: 1, borderColor: neutral44, width: "100%" },
        style,
      ]}
    />
);

export const ResourceBox: React.FC<{
    }> = ({ }) => {

    return (
    <TertiaryBox width={630} height={330} mainContainerStyle={{backgroundColor: "red"}} style={{marginBottom: 20}}>
        {/* <ImageBackground> */}
        <View style={{flexDirection: "row", bottom: 130, right: 0, width: 610, flexWrap: "wrap", justifyContent: "space-between"}}>
            <View style={{flexDirection: "row"}}>
                <View style={{backgroundColor: "#0000004D", borderRadius: 8, width: "fit-content", height: 28, justifyContent: "center", alignContent: "center", marginRight: 5}}>
                    <BrandText style={{fontSize: 13}}>
                    {"   Video   "}
                    </BrandText>
                </View>
                <View style={{backgroundColor: "#0000004D", borderRadius: 8, width: "fit-content", height: 28, justifyContent: "center", alignContent: "center"}}>
                    <BrandText style={{fontSize: 13}}>
                    {"   Video   "}
                    </BrandText>
                </View>
            </View>
            <View style={{flexDirection: "row"}}>

                <TouchableOpacity>
                    <View style={{backgroundColor: "#0000004D", borderRadius: 8, width: 40, height: 40, justifyContent: "center", alignItems: "center", marginRight: 5}}>
                        <CgOptions color="white" style={{width: 22, height: 22}}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{backgroundColor: "#0000004D", borderRadius: 8, width: 40, height: 40, justifyContent: "center", alignItems: "center"}}>
                        <AiOutlineHeart color="white" style={{width: 22, height: 22}}/>
                    </View>
                </TouchableOpacity>
            </View>
        </View>

        <View style={{backgroundColor: "#0000004D", width: 330, height: 86, borderRadius: 6, top: 230, right: 285, position: "absolute", alignContent: "center", justifyContent: "center"}}>
            <View style={{marginLeft: 10}}>
                <BrandText style={{fontSize: 20}}>
                    {"Hello World!"}
                </BrandText>
                <BrandText style={{fontSize: 13}}>
                    {"Video description"}
                </BrandText>
            </View>
        </View>
        {/* </ImageBackground> */}
    </TertiaryBox>
    )
}