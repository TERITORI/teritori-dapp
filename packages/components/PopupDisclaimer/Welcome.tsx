import React from "react";
import { View } from "react-native";

import { useAppNavigation } from "../../utils/navigation";
import { BrandText } from "../BrandText";
import { PrimaryButton } from "../buttons/PrimaryButton";

export const Welcome: React.FC = () => {
  const navigation = useAppNavigation();
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <BrandText>Principal Screen</BrandText>
      <PrimaryButton
        size="XL"
        style={{ marginTop: 72 }}
        text="Enter the dApp"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
};
