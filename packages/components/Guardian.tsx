import React from "react";
import { Image, View } from "react-native";

import guardianPNG from "../../assets/default-images/guardian_1.png";

export const Guardian: React.FC = () => (
  <View style={{ alignItems: "center" }}>
    <View
      style={{
        borderColor: "#00C6FB",
        borderWidth: 1,
        borderRadius: 8,
        maxWidth: 204,
        overflow: "hidden",
      }}
    >
      <Image source={guardianPNG} style={{ height: 280, aspectRatio: 1 }} />
    </View>
  </View>
);
