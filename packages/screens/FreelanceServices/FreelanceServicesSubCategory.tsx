import React from "react";

import { ScreenFC } from "../../utils/navigation";
import { LogoDesign } from "./Category/Subcategory/LogoDesign";
import { FreelanceServicesScreenWrapper } from "./FreelanceServicesScreenWrapper";
export const FreelanceServicesSubCategory: ScreenFC<
  "FreelanceServicesSubCategory"
> = ({
  route: {
    params: { category, subcategory },
  },
}) => {
  return (
    <FreelanceServicesScreenWrapper>
      {category === "GraphicsAndDesign" && subcategory === "LogoDesign" && (
        <LogoDesign />
      )}
    </FreelanceServicesScreenWrapper>
  );
};
