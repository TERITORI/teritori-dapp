import * as React from "react";
import { View } from "react-native";

import { primaryColor } from "../../utils/colors";
import { BrandText } from "../BrandText";

export const LoaderFullScreen: React.FC = () => {
  return (
    <View
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,.8)",
        position: "absolute",
        zIndex: 10,
      }}
    >
      <View
        style={{
          height: 80,
          width: 80,
          backgroundColor: primaryColor,
          borderRadius: 999,
          margin: "auto",
        }}
      >
        {/*TODO: Which design ?*/}
        <BrandText style={{ margin: "auto", fontSize: 30 }}>⛩</BrandText>
      </View>
    </View>
  );
};
