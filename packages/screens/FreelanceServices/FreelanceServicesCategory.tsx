import React from "react";

import { ScreenFC } from "../../utils/navigation";
import { GraphicsAndDesign } from "./Category/GraphicsAndDesign";
import { FreelanceServicesScreenWrapper } from "./FreelanceServicesScreenWrapper";
export const FreelanceServicesCategory: ScreenFC<
  "FreelanceServicesCategory"
> = ({
  route: {
    params: { category },
  },
}) => {
  return (
    <FreelanceServicesScreenWrapper>
      {category === "GraphicsAndDesign" && <GraphicsAndDesign />}
    </FreelanceServicesScreenWrapper>
  );
};
