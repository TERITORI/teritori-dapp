import { FC, ReactNode } from "react";

import {
  gradientColorBlue,
  gradientColorDarkerBlue,
  gradientColorTurquoise,
} from "../../../../utils/style/colors";
import { layout } from "../../../../utils/style/layout";
import { PrimaryBox } from "../../../boxes/PrimaryBox";

export const ToolbarContainer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <PrimaryBox
      fullWidth
      colors={[
        gradientColorDarkerBlue,
        gradientColorBlue,
        gradientColorTurquoise,
      ]}
      style={{ flex: 1 }}
      mainContainerStyle={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: layout.spacing_x0_5,
      }}
    >
      {children}
    </PrimaryBox>
  );
};
