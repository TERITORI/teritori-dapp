import React from "react";

// import { GraphicsAndDesign } from "./Category/GraphicsAndDesign";
import { CategoryView } from "./Category/CategoryView";
import { FreelanceScreenBase } from "./FreelanceScreenBase";
import { ScreenFC } from "../../utils/navigation";
export const FreelanceServicesCategoryScreen: ScreenFC<
  "FreelanceServicesCategory"
> = ({
  route: {
    params: { category },
  },
}) => {
  return (
    <FreelanceScreenBase>
      <CategoryView category={category} />
      {/* {category === "GraphicsAndDesign" && <GraphicsAndDesign />} */}
    </FreelanceScreenBase>
  );
};
