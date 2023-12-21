import React, { FC, ReactNode } from "react";

import {
  gradientColorBlue,
  gradientColorDarkerBlue,
  gradientColorTurquoise,
} from "../../../../utils/style/colors";
import { layout } from "../../../../utils/style/layout";
import { Box } from "../../../boxes/Box";

export const ToolbarContainer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box
      notched
      borderGradient={{
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        locations: [0.7, 0.8],
        colors: [
          gradientColorDarkerBlue,
          gradientColorBlue,
          gradientColorTurquoise,
        ],
      }}
      style={{
        flex: 1,
        width: "100%",
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: layout.spacing_x0_5,
      }}
    >
      {children}
    </Box>
  );
};
