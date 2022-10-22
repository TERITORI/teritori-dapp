import React from "react";
import { View, TouchableOpacity } from "react-native";

import githubLogo from "../../../assets/icons/Pathwar/github.svg";
import informationBlueIcon from "../../../assets/icons/Pathwar/informationBlueIcon.svg";
import twitterLogo from "../../../assets/icons/Pathwar/twitter.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";

export const ConnectBar: React.FC<object> = () => {
  return (
    <View
      style={{
        backgroundColor: "#171717",
        width: "100%",
        height: 72,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#16BBFF",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "97%",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: 20,
        }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View>
            <SVG source={informationBlueIcon} />
          </View>
          <BrandText style={{ fontSize: 13, marginLeft: 10 }}>
            Login to play challenges and learn hacking.
          </BrandText>
        </View>
        <View
          style={{
            alignItems: "flex-end",
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <View style={{ marginRight: 10 }}>
            <TouchableOpacity>
              <TertiaryBox
                width={169}
                height={46}
                mainContainerStyle={{ backgroundColor: "white" }}
                squaresBackgroundColor="#171717"
              >
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <SVG source={twitterLogo} />
                  <BrandText
                    style={{ fontSize: 13, color: "black", marginLeft: 5 }}
                  >
                    Login via Twitter
                  </BrandText>
                </View>
              </TertiaryBox>
            </TouchableOpacity>
          </View>
          <View style={{ marginRight: 10 }}>
            <TouchableOpacity>
              <TertiaryBox
                width={169}
                height={46}
                mainContainerStyle={{ backgroundColor: "white" }}
                squaresBackgroundColor="#171717"
              >
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <SVG source={githubLogo} />
                  <BrandText
                    style={{ fontSize: 13, color: "black", marginLeft: 5 }}
                  >
                    Login via Github
                  </BrandText>
                </View>
              </TertiaryBox>
            </TouchableOpacity>
          </View>
          <View style={{ marginRight: 10 }}>
            <TouchableOpacity onPress={() => {}}>
              <TertiaryBox
                width={94}
                height={46}
                mainContainerStyle={{ backgroundColor: "#171717" }}
                squaresBackgroundColor="#171717"
              >
                <BrandText style={{ fontSize: 13, color: "white" }}>
                  Register
                </BrandText>
              </TertiaryBox>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
