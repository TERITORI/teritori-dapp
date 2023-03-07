import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { useMention } from "../../hooks/feed/useMention";
import { useAppNavigation } from "../../utils/navigation";
import { neutralA3, primaryColor } from "../../utils/style/colors";

export const MentionRender: React.FC<{ text: string }> = ({ text }) => {
  const navigation = useAppNavigation();
  const { userId } = useMention(text);

  // Every text with a "@" is a mention. But we consider valid mentions as a valid wallet address or a valid NS token id.
  if (!userId) {
    return <Text style={{ color: neutralA3 }}>{text}</Text>;
  }
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("UserPublicProfile", {
          id: userId,
        })
      }
    >
      <Text style={{ color: primaryColor }}>{text}</Text>
    </TouchableOpacity>
  );
};
