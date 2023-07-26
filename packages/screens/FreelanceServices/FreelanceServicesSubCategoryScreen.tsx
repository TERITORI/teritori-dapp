import React from "react";

// import { LogoDesign } from "./Category/Subcategory/LogoDesign";
import { SubCategoryView } from "./Category/SubCategoryView";
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
      <SubCategoryView category={category} subcategory={subcategory} />
    </ScreenContainer>
  );
};
