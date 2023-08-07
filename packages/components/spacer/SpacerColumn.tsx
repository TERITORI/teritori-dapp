import React, { memo } from "react";
import { View } from "react-native";

import { layout } from "../../utils/style/layout";

export type SpacerProps = {
  size: number;
};

export const SpacerColumn: React.FC<SpacerProps> = memo(({ size }) => (
  <View
    style={{
      height: layout.padding_x1 * size,
    }}
  />
));
