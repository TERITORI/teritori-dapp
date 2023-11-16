import React, { useState } from "react";
import { View } from "react-native";
import { RadioButton } from "react-native-paper";

import {
  neutral00,
  primaryColor,
  secondaryColor,
} from "../../../../utils/style/colors";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText/BrandText";
import { Separator } from "../../../Separator";
import { TertiaryBox } from "../../../boxes/TertiaryBox";
import { SecondaryButton } from "../../../buttons/SecondaryButton";

export const DeliveryTimeDropDownMenu: React.FC = () => {
  const [isChecked, setIsChecked] = useState("");

  return (
    <TertiaryBox
      style={{ position: "absolute", top: 60, left: 0, zIndex: 100 }}
      mainContainerStyle={{ borderColor: secondaryColor }}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          marginLeft: 10,
          marginRight: 160,
          marginTop: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="Express 24H"
            color="#16BBFF"
            uncheckedColor="#777777"
            status={isChecked === "Express 24H" ? "checked" : "unchecked"}
            onPress={() => setIsChecked("Express 24H")}
          />

          <BrandText style={fontSemibold14}>Express 24H</BrandText>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="Up to 3 days"
            color="#16BBFF"
            uncheckedColor="#777777"
            status={isChecked === "Up to 3 days" ? "checked" : "unchecked"}
            onPress={() => setIsChecked("Up to 3 days")}
          />
          <BrandText style={fontSemibold14}>Up to 3 days</BrandText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="Up to 7 days"
            color="#16BBFF"
            uncheckedColor="#777777"
            status={isChecked === "Up to 7 days" ? "checked" : "unchecked"}
            onPress={() => setIsChecked("Up to 7 days")}
          />
          <BrandText style={fontSemibold14}>Up to 7 days</BrandText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="Anytime"
            color="#16BBFF"
            uncheckedColor="#777777"
            status={isChecked === "Anytime" ? "checked" : "unchecked"}
            onPress={() => setIsChecked("Anytime")}
          />
          <BrandText style={fontSemibold14}>Anytime</BrandText>
        </View>
      </View>
      <Separator
        style={{
          width: "100%",
          alignSelf: "center",
          marginTop: 20,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          marginTop: 20,
          justifyContent: "space-around",
          width: "100%",
          marginBottom: 20,
        }}
      >
        <SecondaryButton
          size="SM"
          text="Clear All"
          onPress={() => {
            setIsChecked("");
          }}
        />
        <SecondaryButton
          size="SM"
          text="Apply"
          backgroundColor={primaryColor}
          color={neutral00}
        />
      </View>
    </TertiaryBox>
  );
};
