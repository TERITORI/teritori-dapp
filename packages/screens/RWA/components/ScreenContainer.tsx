import React from "react";
import { SafeAreaView, View } from "react-native";

type RWAScreenContainerProps = {
  children: React.ReactNode;
};

export const RWAScreenContainer: React.FC<RWAScreenContainerProps> = ({
  children,
}) => {
  return (
    <SafeAreaView style={{ width: "100%", flex: 1 }}>
      <View style={{ margin: 20 }}>{children}</View>
    </SafeAreaView>
  );
};
