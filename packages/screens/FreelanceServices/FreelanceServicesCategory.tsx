import React from "react";

import { GraphicsAndDesign } from "./Category/GraphicsAndDesign";
import { FreelanceServicesScreenWrapper } from "./FreelanceServicesScreenWrapper";
import { ScreenFC } from "../../utils/navigation";
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
