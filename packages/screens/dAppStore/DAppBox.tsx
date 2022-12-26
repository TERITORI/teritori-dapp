import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import burnSVG from "../../../assets/icons/burn.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { SecondaryBox } from "../../components/boxes/SecondaryBox";
import {
  gradientColorBlue,
  mineShaftColor,
  neutral17,
  neutral44,
  neutral67,
  withAlpha,
} from "../../utils/style/colors";
import { fontMedium14, fontSemibold12 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export interface dAppType {
  title: string;
  description: string;
  icon: string;
  isChecked: boolean;
}

function MyCheckbox({
  isChecked,
  setChecked,
}: {
  isChecked: boolean;
  setChecked: (e: boolean) => void;
}) {
  return (
    <View style={styles.container}>
      <Checkbox
        style={[styles.checkbox]}
        value={isChecked}
        onValueChange={setChecked}
        color={isChecked ? gradientColorBlue : neutral44}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: layout.padding_x2,
    marginVertical: layout.padding_x4,
  },
  checkbox: {
    margin: layout.padding_x1,
    width: layout.padding_x2_5,
    height: layout.padding_x2_5,
    borderRadius: 4,
    borderWidth: 1,
  },
});

export function DAppBox(props: { option: dAppType }) {
  const [isChecked, setChecked] = useState(props.option.isChecked);

  return (
    <SecondaryBox
      height={85}
      width={320}
      noBrokenCorners
      style={{
        marginRight: 12,
        marginBottom: 12,
      }}
      mainContainerStyle={{
        alignItems: "flex-start",
        padding: layout.padding_x1,
        borderRadius: 22,
        borderColor: mineShaftColor,
        backgroundColor: isChecked ? withAlpha(neutral17, 0.64) : undefined,
        borderWidth: 1,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
      >
        <SecondaryBox
          noBrokenCorners
          style={{ marginLeft: 6 }}
          mainContainerStyle={{
            backgroundColor: withAlpha(neutral17, 0.64),
            borderRadius: 6,
            padding: 6,
          }}
          width={64}
          height={64}
          cornerWidth={5.5}
        >
          <SVG source={burnSVG} />
        </SecondaryBox>
        <View
          style={{
            flexDirection: "column",
            marginLeft: layout.padding_x2,
            width: "50%",
          }}
        >
          <BrandText style={[fontMedium14]} numberOfLines={1}>
            {props.option.title}
          </BrandText>
          <BrandText
            style={[
              fontSemibold12,
              { color: neutral67, marginTop: layout.padding_x0_5 },
            ]}
            numberOfLines={1}
          >
            {props.option.description}
          </BrandText>
        </View>
        <MyCheckbox isChecked={isChecked} setChecked={setChecked} />
      </View>
    </SecondaryBox>
  );
}
