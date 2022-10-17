import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import { TertiaryBox } from "../../components/boxes/TertiaryBox";

import { IoIosInformationCircle } from 'react-icons/Io';

import { AiOutlineTwitter, AiOutlineGithub } from 'react-icons/ai';
import { BrandText } from "../../components/BrandText";

import { RegisterScreen } from "./RegisterScreen";

export const ConnectBar: React.FC<{
  }> = ({ }) => {
    const [displayRegisterScreen, setdisplayRegisterScreen] = useState(false);
    return (
        <View style={{backgroundColor: "#171717", width: "100%", height: 72, borderRadius: 20, borderWidth: 1, borderColor: "#16BBFF", justifyContent: 'center'}}>
           {/* <RegisterScreen visible={true} onClose={() => {setdisplayRegisterScreen(false)}}/> */}
           <View style={{
                    display: "flex",
                    flexDirection: "row", 
                    width: "97%",
                    alignItems: "center", 
                    justifyContent: "space-between",
                    marginLeft: 20,
                }}>
                <View style={{ display: "flex", alignItems: "center",flexDirection: "row"}}>
                    <View>
                        <IoIosInformationCircle style={{width: 20, height: 20, color: "#16BBFF"}}/>
                    </View>
                    <BrandText style={{fontSize: 13, marginLeft: 10}}>
                    Login to play challenges and learn hacking.
                    </BrandText>
                </View>
                <View style={{alignItems: "flex-end", justifyContent: "space-between", display: "flex", flexDirection: "row"}}>
                    <View style={{marginRight: 10}}>
                        {/* <a style={{cursor: "pointer"}}> */}
                        <TouchableOpacity>
                            <TertiaryBox width={169} height={46} mainContainerStyle={{backgroundColor: "white"}} squaresBackgroundColor="#171717">
                                <View style={{display: "flex", flexDirection: "row"}}>
                                    <AiOutlineTwitter/>
                                    <BrandText style={{fontSize: 13, color: "black", marginLeft: 5}}>
                                        Login via Twitter
                                    </BrandText>
                                </View>
                            </TertiaryBox>
                        </TouchableOpacity>
                        {/* </a> */}
                    </View>
                    <View style={{marginRight: 10}}>
                        {/* <a style={{cursor: "pointer"}}> */}
                        <TouchableOpacity>
                            <TertiaryBox width={169} height={46} mainContainerStyle={{backgroundColor: "white"}} squaresBackgroundColor="#171717">
                                <View style={{display: "flex", flexDirection: "row"}}>
                                    <AiOutlineGithub/>
                                    <BrandText style={{fontSize: 13, color: "black", marginLeft: 5}}>
                                        Login via Github
                                    </BrandText>
                                </View>
                            </TertiaryBox>
                        </TouchableOpacity>
                        {/* </a> */}
                    </View>
                    <View style={{marginRight: 10}}>
                        {/* <a style={{cursor: "pointer"}}> */}
                        <TouchableOpacity onPress={() => {}}>
                            <TertiaryBox width={94} height={46} mainContainerStyle={{backgroundColor: "#171717"}} squaresBackgroundColor="#171717">
                                <BrandText style={{fontSize: 13, color: "white"}}>
                                    Register
                                </BrandText>
                            </TertiaryBox>
                        </TouchableOpacity>
                        {/* </a> */}
                    </View>
                </View>
            </View>
        </View>
    )
  }