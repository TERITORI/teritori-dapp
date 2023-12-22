import { FC, ReactNode } from "react";

import { layout } from "../../../../utils/style/layout";
import { PrimaryBox } from "../../../boxes/PrimaryBox";

export const ToolbarContainer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <PrimaryBox
      style={{
        flex: 1,
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
