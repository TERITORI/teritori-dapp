import React from "react";
import { View } from "react-native";

import { TertiaryBox } from "../boxes/TertiaryBox";
import { BrandText } from "../BrandText";

import Stats from "../../../assets/LogoPathwarOverview/Stats.png";
import GoToPage from "../../../assets/LogoPathwarOverview/GoToPage.png";
import Book from "../../../assets/LogoPathwarOverview/Book.png";
import Code from "../../../assets/LogoPathwarOverview/Code.png";
import Planete from "../../../assets/LogoPathwarOverview/Planete.png";
import Tournament from "../../../assets/LogoPathwarOverview/Tournament.png";

import { useAppNavigation } from "../../utils/navigation";

export const NavBarPathwarOverview: React.FC<{
}> = ({ }) => {
    const navigation = useAppNavigation();
  return (
    <>
    <BrandText style={{fontSize: 28, marginTop: 20, marginBottom: 20}}>
    Pathwar Overview
    </BrandText>

    <View style={{display: "flex", flexDirection: "row", alignContent: "center", justifyContent: "space-between"}}>
        <TertiaryBox width={240} height={150} mainContainerStyle={{backgroundColor: "#171717"}}>
            <View style={{display: "flex", flexDirection: "row", alignContent: "center", justifyContent: "space-between", width: "96%", bottom: "11%"}}>
                <View style={{ marginTop: 8, marginLeft: 5 }}>
                    <img src={Stats} />
                </View>
                <TertiaryBox width={170} height={70} mainContainerStyle={{backgroundColor: "#000000"}} leftSquaresBackgroundColor="#171717" rightSquaresBackgroundColor="#171717">
                    <View style={{display: "flex", flexDirection: "column", alignContent: "flex-start", alignItems: "flex-start", width: "86%"}}>
                        <BrandText style={{fontSize: 10}}>
                        Top 1 
                        </BrandText>
                        <BrandText style={{fontSize: 10}}>
                        Top 2 
                        </BrandText>
                        <BrandText style={{fontSize: 10}}>
                        Top 3 
                        </BrandText>
                        <BrandText style={{fontSize: 10}}>
                        Top 4 
                        </BrandText>
                    </View>
                </TertiaryBox>
            </View>
            <View style={{display: "flex", flexDirection: "row", alignContent: "center", justifyContent: "space-between", width: "93%", top: 10, alignItems: "center"}}>
                <BrandText style={{fontSize: 16}}>
                Statistics
                </BrandText>
                <a style={{cursor: "pointer"}} onClick={() => navigation.navigate("Statistics")}>
                    <img src={GoToPage}/>
                </a>
            </View>
        </TertiaryBox>

        <TertiaryBox width={240} height={150} mainContainerStyle={{backgroundColor: "#171717"}}>
                <View style={{ bottom: 26, right: 90}}>
                    <img src={Book} />
                </View>
            <View style={{display: "flex", flexDirection: "row", alignContent: "center", justifyContent: "space-between", width: "93%", top: 25, alignItems: "center"}}>
                <BrandText style={{fontSize: 16}}>
                Ressources
                </BrandText>
                <a style={{cursor: "pointer"}} onClick={() => navigation.navigate("Resources")}>
                    <img src={GoToPage}/>
                </a>
            </View>
        </TertiaryBox>

        <TertiaryBox width={240} height={150} mainContainerStyle={{backgroundColor: "#171717"}}>
                <View style={{ bottom: 26, right: 90}}>
                    <img src={Planete} />
                </View>
            <View style={{display: "flex", flexDirection: "row", alignContent: "center", justifyContent: "space-between", width: "93%", top: 25, alignItems: "center"}}>
                <BrandText style={{fontSize: 16}}>
                Gno.land
                </BrandText>
                <a style={{cursor: "pointer"}}>
                    <img src={GoToPage}/>
                </a>
            </View>
        </TertiaryBox>

        <TertiaryBox width={240} height={150} mainContainerStyle={{backgroundColor: "#171717"}}>
                <View style={{ bottom: 26, right: 90}}>
                    <img src={Code} />
                </View>
            <View style={{display: "flex", flexDirection: "row", alignContent: "center", justifyContent: "space-between", width: "93%", top: 25, alignItems: "center"}}>
                <BrandText style={{fontSize: 16}}>
                Cosmos Academy
                </BrandText>
                <a style={{cursor: "pointer"}}>
                    <img src={GoToPage}/>
                </a>
            </View>
        </TertiaryBox>

        <TertiaryBox width={240} height={150} mainContainerStyle={{backgroundColor: "#171717"}}>
            <View style={{ bottom: 26, right: 90}}>
                <img src={Tournament} />
            </View>

            <View style={{display: "flex", flexDirection: "row", alignContent: "center", justifyContent: "space-between", width: "93%", top: 25, alignItems: "center"}}>
                <BrandText style={{fontSize: 16}}>
                Tournaments
                </BrandText>
                <View style={{ 
                            width: 44,
                            height: 32,
                            borderRadius: 32, 
                            borderWidth: 0.5,
                            borderColor: "#333333", 
                            justifyContent: "center", 
                            alignItems: "center",
                            marginLeft: 10}}>
                    <BrandText style={{fontSize: 20, color: "#16BBFF"}}>
                        3
                    </BrandText>
                </View>
                <a style={{cursor: "pointer"}} onClick={() => navigation.navigate("Tournaments")}>
                    <img src={GoToPage}/>
                </a>
            </View>
        </TertiaryBox>
    </View>
    </>
  )
}