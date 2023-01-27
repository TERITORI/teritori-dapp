import React from "react";
import { Text } from "react-native";

import { useAppNavigation } from "../../utils/navigation";
import { primaryColor } from "../../utils/style/colors";

export const MentionRender = ({ text }: { text: string }) => {
  const navigation = useAppNavigation();

  return (
    <Text
      style={{ color: primaryColor, cursor: "pointer" }}
      onClick={() =>
        navigation.navigate("PublicProfile", {
          id: text.replace("@", ""),
        })
      }
    >
      {text}
    </Text>
  );
};
