import React from "react";

// import { GraphicsAndDesign } from "./Category/GraphicsAndDesign";
import { CategoryView } from "./Category/CategoryView";
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
      <CategoryView category={category} />
      {/* {category === "GraphicsAndDesign" && <GraphicsAndDesign />} */}
    </ScreenContainer>
  );
};
