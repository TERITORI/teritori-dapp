import React from "react";
import { View } from "react-native";

import illustrationSVG from "../../../../assets/icons/illustration.svg";
import { SVG } from "../../../components/SVG";
import { neutral00 } from "../../../utils/style/colors";

export const MessageBlankFiller = () => {
  return (
    <View
      style={{
        backgroundColor: neutral00,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SVG source={illustrationSVG} width={400} height={400} />
    </View>
  );
};
