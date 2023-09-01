import React from "react";
import { View } from "react-native";

import { SpacerProps } from "./SpacerColumn";
import { layout } from "../../utils/style/layout";

export const SpacerRow: React.FC<SpacerProps> = ({ size }) => (
  <View
    style={{
      width: layout.spacing_x1 * size,
    }}
  />
);
