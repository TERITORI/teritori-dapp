import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { useAppNavigation } from "../../utils/navigation";
import { primaryColor } from "../../utils/style/colors";
export const HashRender = ({ text }: { text: string }) => {
  const navigation = useAppNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("HashFeed", {
          id: text.replace("#", ""),
        })
      }
    >
      <Text style={{ color: primaryColor }}>{text}</Text>
    </TouchableOpacity>
  );
};
