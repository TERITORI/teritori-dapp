import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { primaryColor } from "../../../../utils/style/colors";

import { router } from "@/utils/router";
export const HashtagRenderer: React.FC<{ text: string }> = ({ text }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        router.navigate({
          pathname: "/feed/tag/[hashtag]",
          params: {
            hashtag: text.replace("#", ""),
          },
        })
      }
    >
      <Text style={{ color: primaryColor }}>{text}</Text>
    </TouchableOpacity>
  );
};
