import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, ViewStyle } from "react-native";

// misc

type SeparatorGradientProps = {
  style?: ViewStyle;
};

export const SeparatorGradient: React.FC<SeparatorGradientProps> = ({
  style,
}) => {
  return (
    <View style={[{ height: 1, width: "100%" }, style]}>
      {/* Background gradient */}
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: "100%", width: "100%" }}
        colors={["#2AF598", "#009EFD"]}
      />
    </View>
  );
};
