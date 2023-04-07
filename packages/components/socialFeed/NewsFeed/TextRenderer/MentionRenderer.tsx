import React from "react";
import { TouchableOpacity } from "react-native";

import { useMention } from "../../../../hooks/feed/useMention";
import { useAppNavigation } from "../../../../utils/navigation";
import { neutralA3, primaryColor } from "../../../../utils/style/colors";
import { fontSemibold13 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText";

export const MentionRenderer: React.FC<{ text: string }> = ({ text }) => {
  const navigation = useAppNavigation();
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
        navigation.navigate("UserPublicProfile", {
          id: userId,
        })
      }
    >
      <BrandText style={[fontSemibold13, { color: primaryColor }]}>
        {text}
      </BrandText>
    </TouchableOpacity>
  );
};
