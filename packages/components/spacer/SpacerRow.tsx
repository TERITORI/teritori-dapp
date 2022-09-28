import React from "react";
import { View } from "react-native";

import { layout } from "../../utils/style/layout";
import { SpacerProps } from "./SpacerColumn";

export const SpacerRow: React.FC<SpacerProps> = ({ size }) => (
  <View
    style={{
      width: layout.padding_x1 * size,
    }}
  />
);
