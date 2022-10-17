import React, { useState } from 'react'

import ModalBase from "../../components/modals/ModalBase";
import { BrandText } from "../../components/BrandText/BrandText";

import checklogo from "../../../assets/icons/checklogo.svg";
// import { SVG } from "../SVG";
import { View, StyleProp, ViewStyle } from 'react-native';
import { neutral44 } from "../../utils/style/colors";
import { useAppNavigation, getCurrentRouteName } from "../../utils/navigation";

const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
    <View
      style={[
        { borderBottomWidth: 1, borderColor: neutral44, width: "100%" },
        style,
      ]}
    />
);

export const NavBarGovernance: React.FC < {
    visible?: boolean;
    onClose: () => void;
  }> = ({ visible, onClose }) => {
    const navigation = useAppNavigation();
    
    const currentPage = getCurrentRouteName(navigation);

    const [activeAllPeriod, setactiveAllPeriod] = useState(currentPage === "AllPeriods" ? true : false);
    const [activeVoting, setactiveVoting] = useState(currentPage === "Voting" ? true : false);
    const [activePassed, setactivePassed] = useState(currentPage === "Passed" ? true : false);
    const [activeRejected, setactiveRejected] = useState(currentPage === "Rejected" ? true : false);

    return (
        <View style={{
            top: 15,
            display: "flex",
            flexWrap: "wrap",
            alignContent: "center",
            justifyContent: "space-between",
            width: "fit-content",
            borderWidth: 0.5,
            borderColor: "#808080",
            flexDirection: "row",
            borderRadius: 20,
            height: 32,
          }}>
            <a style={{cursor: "pointer"}} onClick={() => {navigation.navigate("AllPeriods")}}>
              <View style={{
                      flexDirection: "row",
                      backgroundColor: activeAllPeriod ? "#16BBFF" : "black",
                      borderTopLeftRadius: 18,
                      borderBottomLeftRadius: 18,
                    }}>
                  <BrandText style={{
                      color: activeAllPeriod ? "black" : "white",
                      fontSize: 14,
                      width: 85,
                      height: 32,
                      textAlign: "center",
                      position: "relative",
                      top: 6,
                  }}
                  >
                    All period
                  </BrandText>
                  <View style={{
                        width: 32,
                        height: 0,
                        borderWidth: 0.5,
                        borderColor: "#808080",
                        transform: [{ rotate: "90deg" }],
                        position: "absolute",
                        top: 16,
                        left: 69,
                    }}/>
              </View>
            </a>
  
            <a style={{cursor: "pointer"}} onClick={() => {navigation.navigate("Voting")}}>
              <View style={{
                      flexDirection: "row",
                      backgroundColor: activeVoting ? "#16BBFF" : "black",
                    }}>
                  <BrandText style={{
                      color: activeVoting ? "black" : "white",
                      fontSize: 14,
                      width: 80,
                      height: 32,
                      textAlign: "center",
                      position: "relative",
                      top: 6,
                  }}
                  >
                    Voting
                  </BrandText>
                  <View style={{
                        width: 32,
                        height: 0,
                        borderWidth: 0.5,
                        borderColor: "#808080",
                        transform: [{ rotate: "90deg" }],
                        position: "absolute",
                        top: 16,
                        left: 64,
                    }}/>
              </View>
            </a>
  
            <a style={{cursor: "pointer"}} onClick={() => {navigation.navigate("Passed")}}>
              <View style={{
                        flexDirection: "row",
                        backgroundColor: activePassed ? "#16BBFF" : "black",
                        // borderTopRightRadius: 18,
                        // borderBottomRightRadius: 18,
                      }}>
                  <BrandText style={{
                      color: activePassed ? "black" : "white",
                      fontSize: 14,
                      width: 80,
                      height: 32,
                      textAlign: "center",
                      position: "relative",
                      top: 6,
                  }}>
                    Passed
                  </BrandText>
                  <View style={{
                        width: 32,
                        height: 0,
                        borderWidth: 0.5,
                        borderColor: "#808080",
                        transform: [{ rotate: "90deg" }],
                        position: "absolute",
                        top: 16,
                        left: 64,
                    }}/>
              </View>
            </a>

            <a style={{cursor: "pointer"}} onClick={() => {navigation.navigate("Rejected")}}>
              <View style={{
                        flexDirection: "row",
                        alignItems: "center", 
                        justifyContent: "center", 
                        flex: 1, 
                        backgroundColor: activeRejected ? "#16BBFF" : "black",
                        borderTopRightRadius: 18,
                        borderBottomRightRadius: 18,
                      }}>
                  <BrandText style={{
                      color: activeRejected ? "black" : "white",
                      fontSize: 14,
                      width: 80,
                      height: 32,
                      textAlign: "center",
                      borderTopRightRadius: 18,
                      borderBottomRightRadius: 18,
                      position: "relative",
                      top: 6,
                  }}
                  >
                    Rejected
                  </BrandText>
              </View>
            </a>
        </View>
    )
}
