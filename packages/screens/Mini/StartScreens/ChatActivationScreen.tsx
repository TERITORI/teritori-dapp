import React from "react";
import { SafeAreaView } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { ScreenFC } from "../../../utils/navigation";

export const ChatActivationScreen: ScreenFC<"ChatActivation"> = ({}) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "#000000",
        alignItems: "center",
      }}
    >
      <BrandText>ChatActivationScreen</BrandText>
    </SafeAreaView>
  );
};
