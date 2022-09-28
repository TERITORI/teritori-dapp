import React from "react";
import { View } from "react-native";

import { layout } from "../../utils/style/layout";

export type SpacerProps = {
  size: 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | number;
};

export const SpacerColumn: React.FC<SpacerProps> = ({ size }) => (
  <View
    style={{
      height: layout.padding_x1 * size,
    }}
  />
);
