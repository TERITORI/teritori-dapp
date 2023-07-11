import React from "react";
import { View } from "react-native";

import { Badge } from "./Badge";
import { Status } from "../../../../api/pathwar/v1/pathwar";
import {
  hardColor,
  neutral77,
  secondaryColor,
  successColor,
} from "../../../../utils/style/colors";

export const StatusBadges: React.FC<{ difficulty: string; label: Status }> = ({
  difficulty,
  label,
}) => (
  <View style={{ flexDirection: "row" }}>
    <Badge
      color={
        difficulty.toLowerCase().includes("hard") ? hardColor : successColor
      }
      backgroundColor="#FF5C001A"
      label={difficulty}
    />
    <Badge
      color={secondaryColor}
      label={resolveLabel(label)}
      backgroundColor={neutral77}
    />
  </View>
);

const resolveLabel = (label: Status) => {
  switch (label) {
    case 0:
      return "Open";
    case 1:
      return "Closed";
  }
  return "";
};
