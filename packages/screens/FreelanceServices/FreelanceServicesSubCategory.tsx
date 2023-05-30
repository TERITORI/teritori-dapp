import React from "react";

import { LogoDesign } from "./Category/Subcategory/LogoDesign";
import { FreelanceServicesScreenWrapper } from "./FreelanceServicesScreenWrapper";
import { ScreenFC } from "../../utils/navigation";
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
