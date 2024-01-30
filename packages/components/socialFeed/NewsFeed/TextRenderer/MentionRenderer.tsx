import React from "react";
import { TouchableOpacity } from "react-native";

import { useMention } from "../../../../hooks/feed/useMention";
import { neutralA3, primaryColor } from "../../../../utils/style/colors";
import { fontSemibold13 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText";

import { router } from "@/utils/router";
export const MentionRenderer: React.FC<{ text: string }> = ({ text }) => {
  const { userId } = useMention(text);

  // Every text with a "@" is a mention. But we consider valid mentions as a valid wallet address or a valid NS token id.
  if (!userId) {
    return (
      <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
        {text}
      </BrandText>
    );
  }
  return (
    <TouchableOpacity
      onPress={() =>
        router.navigate({
          pathname: "/user/[id]",
          params: {
            id: userId,
          },
        })
      }
    >
      <BrandText style={[fontSemibold13, { color: primaryColor }]}>
        {text}
      </BrandText>
    </TouchableOpacity>
  );
};
