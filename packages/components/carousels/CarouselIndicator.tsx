import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import { neutral33, neutral44 } from "../../utils/style/colors";

export const CarouselIndicator: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  return (
    <View
      style={[
        {
          borderRadius: 999,
          borderWidth: 1,
          borderColor: neutral33,
          backgroundColor: "#000000",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 6,
          height: 20,
        },
        style,
      ]}
    >
      <TouchableOpacity style={{ height: "100%", marginHorizontal: 2 }}>
        <View
          style={{
            height: 4,
            backgroundColor: neutral44,
            width: 8,
            borderRadius: 999,
          }}
        />
      </TouchableOpacity>

      <TouchableOpacity style={{ height: "100%", marginHorizontal: 2 }}>
        <View
          style={{
            height: 4,
            backgroundColor: neutral44,
            width: 8,
            borderRadius: 999,
          }}
        />
      </TouchableOpacity>

      <TouchableOpacity style={{ height: "100%", marginHorizontal: 2 }}>
        <View
          style={{
            height: 4,
            backgroundColor: neutral44,
            width: 8,
            borderRadius: 999,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};
