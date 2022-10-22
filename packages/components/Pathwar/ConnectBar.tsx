import React from "react";
import { View } from "react-native";

import githubLogo from "../../../assets/icons/Pathwar/github.svg";
import informationBlueIcon from "../../../assets/icons/Pathwar/informationBlueIcon.svg";
import twitterLogo from "../../../assets/icons/Pathwar/twitter.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { SecondaryButtonOutline } from "../../components/buttons/SecondaryButtonOutline";
import {
  neutral17,
  primaryColor,
  neutral00,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const ConnectBar: React.FC<object> = () => {
  return (
    <View
      style={{
        backgroundColor: neutral17,
        width: "100%",
        height: 72,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: primaryColor,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: layout.padding_x2_5,
        }}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View>
            <SVG source={informationBlueIcon} />
          </View>
          <BrandText
            style={[{ marginLeft: layout.padding_x1_5 }, fontSemibold13]}
          >
            Login to play challenges and learn hacking.
          </BrandText>
        </View>
        <View
          style={{
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexDirection: "row",
            marginRight: layout.padding_x1,
          }}
        >
          <View style={{ marginRight: layout.padding_x1_5 }}>
            <SecondaryButton
              size="SM"
              text="Login via Twitter"
              iconSVG={twitterLogo}
              color={neutral00}
              backgroundColor={secondaryColor}
              squaresBackgroundColor={neutral17}
            />
          </View>
          <View style={{ marginRight: layout.padding_x1_5 }}>
            <SecondaryButton
              size="SM"
              text="Login via Github"
              iconSVG={githubLogo}
              color={neutral00}
              backgroundColor={secondaryColor}
              squaresBackgroundColor={neutral17}
            />
          </View>
          <View style={{ marginRight: layout.padding_x1 }}>
            <SecondaryButtonOutline
              size="SM"
              text="Register"
              color={secondaryColor}
              backgroundColor={neutral00}
              squaresBackgroundColor={neutral17}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
