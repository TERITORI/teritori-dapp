import React, { useState } from "react";
import { 
    View,
    StyleProp,
    ViewStyle, 
    TouchableOpacity} 
from "react-native";

import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { neutral44 } from "../../../utils/style/colors";
import TerritoriLogo from "../../../../assets/TerritoriLogo.png";
import { LinearGradient } from 'expo-linear-gradient';

import { AiOutlineCheck } from 'react-icons/ai';
import { AiFillStar } from 'react-icons/ai';
import { HiClock } from 'react-icons/hi';
import { BsFillDiamondFill } from 'react-icons/bs';
import { BrandText } from "../../../components/BrandText";

// import { ChallengeDetails } from "./ChallengeDetailsFiles/ChallengeDetails";

const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
    <View
        style={[
            { borderBottomWidth: 1, borderColor: neutral44, width: "100%" },
            style,
        ]}
    />
);

export const TournamentBox: React.FC<{
    }> = ({ }) => {
    const [displayChallengeDetails, setdisplayChallengeDetails] = useState(false);


    return (
        <TertiaryBox width={630} height={330} mainContainerStyle={{backgroundColor: "#171717"}} style={{marginBottom: 20}}>
            {/* {handleDisplayChallengeDetails()} */}
            <View style={{display: "flex", flexDirection: "column", right: 205}}>
                <TertiaryBox width={196} height={196} leftSquaresBackgroundColor="#171717" rightSquaresBackgroundColor="#171717">
                    {/* img */}
                </TertiaryBox>
                <TertiaryBox width={196} height={47} leftSquaresBackgroundColor="#171717" rightSquaresBackgroundColor="#171717" style={{marginTop: 10}}>
                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: 170}}>
                        <BrandText style={{color: "#777777", fontSize: 13}}>
                            Price
                        </BrandText>
                        <BrandText style={{color: "#FFFFFF", fontSize: 13}}>
                            5,000 TORI
                        </BrandText>
                    </View>
                </TertiaryBox>
                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10}}>
                    <TouchableOpacity>
                        <TertiaryBox width={104} height={40} leftSquaresBackgroundColor="#171717" rightSquaresBackgroundColor="#171717" mainContainerStyle={{backgroundColor: "white"}}>
                            <BrandText style={{color: "black", fontSize: 14}}>
                            Buy
                            </BrandText>
                        </TertiaryBox>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setdisplayChallengeDetails(true)}>
                        <TertiaryBox width={80} height={40} leftSquaresBackgroundColor="#171717" rightSquaresBackgroundColor="#171717" mainContainerStyle={{borderColor: "white",}}>
                            <BrandText style={{color: "white", fontSize: 14}}>
                            More
                            </BrandText>
                        </TertiaryBox>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{flexDirection: "column", left: 220, top: 20, position: "absolute"}}>
                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", 
                marginBottom: 10,
                width: 390}}>
                    <View style={{flexDirection: "column"}}>
                        <BrandText style={{color: "white", fontSize: 16}}>
                        Wild Top50 Contest
                        </BrandText>
                        <BrandText style={{color: "#777777", fontSize: 13, marginTop: 5}}>
                        Reserved to the Top50 members!
                        </BrandText>
                    </View>
                    <View style={{display: "flex", flexDirection: "row"}}>
                        <View style={{backgroundColor: "#FF5C001A", width: 56, height: 28, borderRadius: 100, alignItems: "center", justifyContent: "center", marginRight: 10}}>
                            <BrandText style={{color: "#FF5C00", fontSize: 13}}>
                                Hard+
                            </BrandText>
                        </View>
                        <View style={{backgroundColor: "#777777", width: 56, height: 28, borderRadius: 100, alignItems: "center", justifyContent: "center"}}>
                            <BrandText style={{color: "white", fontSize: 13}}>
                                Open
                            </BrandText>
                        </View>
                    </View>
                </View>
                <Separator style={{
                    marginBottom: 15,
                    width: 390,
                }}/>


                <View style={{
                    width: 390,
                    height: 110,
                    flexDirection: "row",
                    marginBottom: 10,
                    flexWrap: "wrap",
                }}>
                    <BrandText style={{fontSize: 13, color: "#777777"}}>
                    This tournament is a premium online hackathon contest for best
pirates of the platform. Join the competitors for a 3 days of
cyberwar, dangerous investigations and intense challenges</BrandText>
                </View>

                <Separator style={{
                    marginBottom: 10,
                    width: 390,
                }}/>

                <BrandText style={{fontSize: 13, color: "#777777", marginBottom: 5}}>
                Details about this tournament:
                </BrandText>

                <View style={{display: "flex", flexDirection: "row", flexWrap: "wrap", width: "98%", justifyContent: "space-between"}}>
                    <View>
                        <View style={{flexDirection: "row", marginBottom: 5}}>
                            <AiOutlineCheck color="#FFFFFF" />
                            <BrandText style={{fontSize: 12, color: "#FFFFFF", marginLeft: 10}}>
                            31 pirates joined it
                            </BrandText>
                        </View>
                    </View>

                    <View>
                        <View style={{flexDirection: "row", marginBottom: 5}}>
                            <HiClock color="#FFFFFF"/>
                            <BrandText style={{fontSize: 12, color: "#FFFFFF", marginLeft: 10}}>
                            Duration: 3 days
                            </BrandText>
                        </View>
                    </View>
                </View>

                <TertiaryBox width={393} height={42} leftSquaresBackgroundColor="#171717" rightSquaresBackgroundColor="#171717" style={{marginTop: 10}}>
                    <View style={{display: "flex", flexDirection: "row", justifyContent: "center", width: 370}}>

                    <View>

                        <View style={{flexDirection: "row"}}>
                            <BrandText style={{fontSize: 12, color: "#FFFFFF"}}>
                            50 
                            </BrandText>
                            <img src={TerritoriLogo} style={{marginLeft: 4}}/>
                            <BrandText style={{fontSize: 12, color: "#FFFFFF", marginLeft: 4}}>
                            Rewards
                            </BrandText>
                        </View>
                    </View>
                    </View>
                </TertiaryBox>
            </View>
        </TertiaryBox>
    )
}