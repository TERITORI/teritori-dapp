import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

import { GuardiansBox } from "./GuardiansBox";
import blackCricleSVG from "../../../../assets/icons/black-check.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { BoxStyle } from "../../../components/boxes/Box";
import {
  neutralA3,
  neutral17,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

type Props = {
  setIsEditHighlighted: (val: boolean) => void;
};

export const CurrentlyHighlightedProject = ({
  setIsEditHighlighted,
}: Props) => {
  return (
    <View style={{ marginVertical: layout.spacing_x3 }}>
      <TouchableOpacity
        onPress={() => setIsEditHighlighted(false)}
        style={{ alignSelf: "flex-start" }}
      >
        <View style={boxBtn}>
          <SVG source={blackCricleSVG} />
          <BrandText
            style={[fontSemibold13, { color: neutral17, marginLeft: 5 }]}
          >
            Save changes
          </BrandText>
        </View>
      </TouchableOpacity>
      <View style={marginVertical24}>
        <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
          Select the desired collections to display and drag them in the desired
          order.
        </BrandText>
      </View>
      <View style={[{ flex: 1 }, marginVertical24]}>
        <GuardiansBox />
      </View>
    </View>
  );
};

const boxBtn: BoxStyle = {
  flexDirection: "row",
  alignSelf: "flex-start",
  borderRadius: 6,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: layout.spacing_x1_5,
  paddingVertical: layout.spacing_x1,
  backgroundColor: primaryColor,
  marginTop: layout.spacing_x3,
};

const marginVertical24: ViewStyle = {
  marginVertical: layout.spacing_x4,
};
