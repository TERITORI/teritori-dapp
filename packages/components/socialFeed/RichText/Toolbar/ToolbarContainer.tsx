import { FC, ReactNode } from "react";

import {
  gradientColorBlue,
  gradientColorDarkerBlue,
  gradientColorTurquoise,
} from "../../../../utils/style/colors";
import { layout } from "../../../../utils/style/layout";
import { LegacyPrimaryBox } from "../../../boxes/LegacyPrimaryBox";

export const ToolbarContainer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <LegacyPrimaryBox
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
    </LegacyPrimaryBox>
  );
};
