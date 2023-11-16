import React, { useState } from "react";
import { View } from "react-native";

import {
  neutral00,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../../../utils/style/colors";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText/BrandText";
import { Separator } from "../../../Separator";
import { TertiaryBox } from "../../../boxes/TertiaryBox";
import { SecondaryButton } from "../../../buttons/SecondaryButton";
import { TextInputCustom } from "../../../inputs/TextInputCustom";

export const BudgetDropDownMenu: React.FC = () => {
  const [actualMinText, setActualMinText] = useState("");
  const [actualMaxText, setActualMaxText] = useState("");

  return (
    <TertiaryBox
      style={{ position: "absolute", top: 60, left: 0, zIndex: 100 }}
      mainContainerStyle={{ borderColor: secondaryColor }}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          marginLeft: 20,
          marginRight: 20,
          marginTop: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInputCustom
            label=""
            name="minInput"
            placeHolder="Min"
            value={actualMinText}
            onChangeText={setActualMinText}
            width={130}
          />
          <BrandText
            style={[
              { color: neutralA3, marginLeft: 20, marginRight: 20 },
              fontSemibold14,
            ]}
          >
            to
          </BrandText>
          <TextInputCustom
            label=""
            name="maxInput"
            placeHolder="Max"
            value={actualMaxText}
            onChangeText={setActualMaxText}
            width={130}
          />
        </View>
      </View>
      <Separator
        style={{
          width: "100%",
          alignSelf: "center",
          marginTop: 20,
          // marginRight: 32,
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
            setActualMaxText("");
            setActualMinText("");
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
