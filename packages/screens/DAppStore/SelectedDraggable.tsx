import { Bars3Icon } from "@heroicons/react/24/outline";
import React from "react";
import { View } from "react-native";

import burnSVG from "../../../assets/icons/burn.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { SecondaryBox } from "../../components/boxes/SecondaryBox";
import {
  mineShaftColor,
  neutral17,
  neutral33,
  neutral44,
  neutral67,
  withAlpha,
} from "../../utils/style/colors";
import { fontBold12 } from "../../utils/style/fonts";
import { dAppType } from "./DAppBox";

export function SelectedDraggable(props: { option: dAppType }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
      <SecondaryBox
        noBrokenCorners
        style={{ marginLeft: 6 }}
        mainContainerStyle={{
          backgroundColor: withAlpha(neutral33, 0.64),
        }}
        width={32}
        height={50}
      >
        <BrandText style={[fontBold12, { color: neutral67 }]} numberOfLines={1}>
          1
        </BrandText>
      </SecondaryBox>

      <SecondaryBox
        height={50}
        width={256}
        noBrokenCorners
        style={{
          marginLeft: 5,
        }}
        mainContainerStyle={{
          alignItems: "flex-start",
          borderRadius: 8,
          borderColor: mineShaftColor,
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
              padding: 2,
            }}
            width={48}
            height={48}
          >
            <SVG source={burnSVG} />
          </SecondaryBox>
          <View
            style={{ flexDirection: "column", marginLeft: 16, width: "58%" }}
          >
            <BrandText style={[fontBold12]} numberOfLines={1}>
              {props.option.title}
            </BrandText>
          </View>
          <Bars3Icon
            style={{
              width: 24,
              height: 24,
              stroke: neutral44,
            }}
          />
        </View>
      </SecondaryBox>
    </View>
  );
}
