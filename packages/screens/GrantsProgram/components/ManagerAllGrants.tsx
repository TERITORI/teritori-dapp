import React from "react";

import { GrantBox } from "./GrantBox";
import FlexRow from "../../../components/FlexRow";
import { layout } from "../../../utils/style/layout";

export const ManagerAllGrants: React.FC = () => {
  return (
    <FlexRow
      style={{
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {[1, 2, 3, 4, 5, 6, 7].map((id) => {
        return (
          <GrantBox
            containerStyle={{
              marginTop: layout.spacing_x2,
              marginRight: layout.spacing_x2,
            }}
          />
        );
      })}
    </FlexRow>
  );
};
