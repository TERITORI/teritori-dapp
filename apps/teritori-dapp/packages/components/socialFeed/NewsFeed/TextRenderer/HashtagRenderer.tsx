import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { primaryColor } from "../../../../utils/style/colors";

import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
export const HashtagRenderer: React.FC<{ text: string }> = ({ text }) => {
  const navigation = useAppNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("HashtagFeed", {
          hashtag: text.replace("#", ""),
        })
      }
    >
      <Text style={{ color: primaryColor }}>{text}</Text>
    </TouchableOpacity>
  );
};
