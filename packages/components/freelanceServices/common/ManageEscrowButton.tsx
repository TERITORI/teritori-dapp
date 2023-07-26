import React, { FC } from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { useAppNavigation } from "../../../utils/navigation";
import { neutral33 } from "../../../utils/style/colors";

export const ManageEscrowButton: FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const navigation = useAppNavigation();

  return (
    <TouchableOpacity
      style={[
        {
          borderRadius: 8,
          borderColor: neutral33,
          borderWidth: 1,
          paddingVertical: 5,
          paddingHorizontal: 10,
          flexDirection: "row",
        },
        style,
      ]}
      onPress={() => {
        navigation.navigate("FreelanceServicesEscrow", {});
      }}
    >
      <BrandText style={[{ paddingHorizontal: 5, fontSize: 14 }]}>
        Manage Escrow
      </BrandText>
    </TouchableOpacity>
  );
};
