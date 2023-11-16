import React from "react";

import { SubCategoryView } from "./Category/SubCategoryView";
import { FreelanceScreenBase } from "./FreelanceScreenBase";
import { ScreenFC } from "../../utils/navigation";
export const FreelanceServicesSubCategoryScreen: ScreenFC<
  "FreelanceServicesSubCategory"
> = ({
  route: {
    params: { category, subcategory },
  },
}) => {
  return (
    <FreelanceScreenBase>
      <SubCategoryView category={category} subcategory={subcategory} />
    </FreelanceScreenBase>
  );
};
