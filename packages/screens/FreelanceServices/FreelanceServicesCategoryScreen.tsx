import React from "react";

import { GraphicsAndDesign } from "./Category/GraphicsAndDesign";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ScreenFC } from "../../utils/navigation";
export const FreelanceServicesCategoryScreen: ScreenFC<
  "FreelanceServicesCategory"
> = ({
  route: {
    params: { category },
  },
}) => {
  return (
    <ScreenContainer fullWidth noMargin>
      {category === "GraphicsAndDesign" && <GraphicsAndDesign />}
    </ScreenContainer>
  );
};
