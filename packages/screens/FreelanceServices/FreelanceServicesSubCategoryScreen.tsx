import React from "react";

import { LogoDesign } from "./Category/Subcategory/LogoDesign";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ScreenFC } from "../../utils/navigation";
export const FreelanceServicesSubCategoryScreen: ScreenFC<
  "FreelanceServicesSubCategory"
> = ({
  route: {
    params: { category, subcategory },
  },
}) => {
  return (
    <ScreenContainer fullWidth noMargin>
      {category === "GraphicsAndDesign" && subcategory === "LogoDesign" && (
        <LogoDesign />
      )}
    </ScreenContainer>
  );
};
